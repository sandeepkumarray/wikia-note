<?php
require_once "config.php";
require_once "responseClass.php";
require "logWriter.php";

$response = new dbResponse;
$log = new logWriter();



if($_SERVER["REQUEST_METHOD"] == "POST"){
    
	$postdata = file_get_contents("php://input");
	
	$request = json_decode($postdata);	
    $data = json_decode($request->data);
    
    //$log->info("post data".$request->data);
    
	if($data->procedureName == "saveArticle"){
        $log->info("Started checking article title.\r\n");    
		
        $IsTitleExist = false;

        $title = trim($data->title);
        $categoryID = trim($data->categoryID);
        $summary = trim($data->summary);
        $description = base64_encode($data->description);
        $isactive = trim($data->isactive);
        $isfeatured = trim($data->isfeatured);
		$userid = trim($data->userid);
		$bannerimg = !empty($data->bannerimg) ? "'$data->bannerimg'" : "NULL";

		$sql = "SELECT id FROM articles WHERE title = ?";
                
        if($stmt = mysqli_prepare($link, $sql)){
			mysqli_stmt_bind_param($stmt, "s", $title);
			if(mysqli_stmt_execute($stmt)){
				mysqli_stmt_store_result($stmt);
                
				if(mysqli_stmt_num_rows($stmt) == 1){
					$IsTitleExist = true;
					$response->success = false;
					$response->message = "This Title already exists.";
				}
			}
			else{
                $log->info("Executed stm.\r\n"."Error: " . "\r\n" . mysqli_error($link));
				$response->success = false;
				$response->message = "Something went wrong. Please try again later.";
			}
			mysqli_stmt_close($stmt);
			
			if($IsTitleExist == false){

				$sql = "INSERT INTO articles(title, user_id, category_id, description, summary, banner, status,  is_featured, is_active, created_at) 
				VALUES ('$title', $userid, $categoryID, '$description', '$summary', $bannerimg, 2, $isfeatured ,$isactive, sysdate())";

				 //$log->info("sql=.$sql");
				if($stmt = mysqli_prepare($link, $sql)){
					if(mysqli_stmt_execute($stmt)){
                        
				        $log->info("insert_id=.$stmt->insert_id");
						$response->success = true;
						$response->data = $stmt->insert_id;
						$response->message = "Article added successfully!!!";
					} 
					else{
                        $response->success = false;
						$response->message = "Something went wrong. Please try again later.";
					}
					mysqli_stmt_close($stmt);
				}
				else{
					$response->success = false;
					$response->message = "Error: " . $sql . "<br>" . mysqli_error($link);
				}
			}
		}
    }
    
	if($data->procedureName == "saveArticleAsDraft"){
        $log->info("Started checking article title.\r\n");    
		
        $IsTitleExist = false;

        $title = trim($data->title);
        $slug = trim($data->slug);
        $categoryID = trim($data->categoryID);
        $summary = trim($data->summary);
        $description = null;
        $isactive = trim($data->isactive);
        $isfeatured = trim($data->isfeatured);
		$userid = trim($data->userid);
        $bannerimg = !empty($data->bannerimg) ? "'$data->bannerimg'" : "NULL";
        $sections = $data->sections;
        $infocard = $data->infocard;
        $type = $data->type;
        
        $sql = "SELECT id FROM articles WHERE title = '$title'";
        
        $result = mysqli_query($link, $sql);
		
		//$log->info("sql=.$sql");
		 
        if ($result) {
			$row_cnt = $result->num_rows;
            if ($row_cnt > 0) {
                $response->success = false;
                $response->message = "Article title $title is already taken.";
            }
            else {
                $sql = "INSERT INTO articles(title, slug, user_id, category_id, description, summary, banner, status, is_featured, is_active, type , created_at) 
				VALUES ('$title', '$slug', $userid, '$categoryID', '$description', '$summary', $bannerimg, 1 , $isfeatured ,$isactive, $type, sysdate())";

				$log->info("article insert sql = $sql");
				if($stmt = mysqli_prepare($link, $sql)){
					if(mysqli_stmt_execute($stmt)){
                        
				        $log->info("insert_id=.$stmt->insert_id");
                        $response->success = true;
                        $article_id = $stmt->insert_id;
                        $response->data = $stmt->insert_id;
                        
                        //Insert sections
                        // begin the sql statement                       
						
						foreach($sections as $key => $value) {
							$sql = "INSERT INTO sections (title, content, article_id ) VALUES ";
                            $secTitle = "";
                            $secContent = $value->description;

							if(isset($value->title) || is_object($value->title))
                            {
                                $secTitle = $value->title;
                            }
							$sql .= '("'.$secTitle.'","' .($secContent).'", $article_id)';
                            
                            $log->info("Section insert sql = $sql");
							mysqli_query( $link, $sql );  
                        }
                        
                        if(!empty($infocard)){

                            $sql="DELETE FROM infocard WHERE article_id=$article_id";
							mysqli_query( $link, $sql );

                            $sql="INSERT INTO infocard(article_id, infocard) VALUES ($article_id, '$infocard')";
                            
                            $log->info("infocard insert sql = $sql");
							mysqli_query( $link, $sql );
                        }

						$response->message = "Article saved as draft!!!";
					}
					else{
                        $response->success = false;
						$response->message = "Something went wrong. Please try again later.". mysqli_error($link);
					}
					mysqli_stmt_close($stmt);
				}
				else{
					$response->success = false;
					$response->message = "Error: " ."<br>" . mysqli_error($link);
				}
            }
        }
        else {
            $response->success = false;
            $response->message = "Error: ". "<br>" . mysqli_error($link);
        }
    }
    
    if($data->procedureName == "saveCategory"){
        $log->info("Started checking Category.\r\n");    
		
        $IsCategoryExist = false;

        $category_name = trim($data->category_name);      

		$sql = "SELECT id FROM categories WHERE category_name = ?";
                
        if($stmt = mysqli_prepare($link, $sql)){
			mysqli_stmt_bind_param($stmt, "s", $category_name);
			if(mysqli_stmt_execute($stmt)){
				mysqli_stmt_store_result($stmt);
                
				if(mysqli_stmt_num_rows($stmt) == 1){
					$IsCategoryExist = true;
					$response->success = false;
					$response->message = "This Category Name already exists.";
				}
			}
			else{
                $log->info("Executed stm.\r\n"."Error: " . "\r\n" . mysqli_error($link));
				$response->success = false;
				$response->message = "Something went wrong. Please try again later.";
			}
			mysqli_stmt_close($stmt);
			
			if($IsCategoryExist == false){

				$sql = "INSERT INTO categories(category_name) VALUES ('$category_name')";

				 //$log->info("sql=.$sql");
				if($stmt = mysqli_prepare($link, $sql)){
					if(mysqli_stmt_execute($stmt)){
                        
				        $log->info("insert_id=.$stmt->insert_id");
						$response->success = true;
						$response->data = $stmt->insert_id;
						$response->message = "Category Name added Successfully!!!";
					} 
					else{
                        $response->success = false;
						$response->message = "Something went wrong. Please try again later.";
					}
					mysqli_stmt_close($stmt);
				}
				else{
					$response->success = false;
					$response->message = "Error: " . $sql . "<br>" . mysqli_error($link);
				}
			}
		}
    }

	if($data->procedureName == "updateArticle"){
        
        $title = trim($data->title);
        $slug = trim($data->slug);
        $categoryID = trim($data->categoryID);
        $summary = trim($data->summary);
        $description = null;
        $isactive = trim($data->isactive);
        $isfeatured = trim($data->isfeatured);
		$userid = trim($data->userid);
        $bannerimg = !empty($data->bannerimg) ? "'$data->bannerimg'" : "NULL";
        $status = $data->status;
        $sections = $data->sections;
        $deletedSections = $data->deletedSections;
        $article_id = $data->id;
        $infocard = $data->infocard;
        $type = $data->type;

        $sql="
        UPDATE articles SET 
        title='$title',
        slug='$slug',
        user_id=$userid,
        category_id='$categoryID' ,
        description='$description',
        summary='$summary',
        banner=$bannerimg,
        status=$status,
        is_featured=$isfeatured ,
        is_active=$isactive
        WHERE id = $article_id";

		$log->info("update sql = $sql");
         
        if($stmt = mysqli_prepare($link, $sql)){
            if(mysqli_stmt_execute($stmt)){
                
                $response->success = true;
                
                //update sections
                // begin the sql statement                       
                
                foreach($sections as $key => $value) {

                    if(empty($value->id)){                        
                        $log->info("id is empty");
                        $sql = "INSERT INTO sections (title, content, article_id ) VALUES ";
                        $secTitle = "";
                        $secContent = $value->description;

                        $log->info("Section insert title = $value->title");
                        
                        $log->info("isset =". isset($value->title));
                        $log->info("is_object =". is_object($value->title));

                        if(isset($value->title) || is_object($value->title))
                        {
                            $secTitle = $value->title;
                        }

                        $sql .= '("'.$secTitle.'","' .($secContent).'",'. $article_id.')';
                        
                        
                        $log->info("Section insert sql = $sql");
                        mysqli_query( $link, $sql );
                    }
                    else{
                        $sql = "UPDATE sections SET
                        title='$value->title',
                        content='" .$value->description."',
                        status=null
                        WHERE id = $value->id";

                        $log->info("update section sql = $sql");

                        $sql = 'UPDATE sections SET
                        title="'.$value->title.'",
                        content="'.$value->description.'",
                        status=null
                        WHERE id = '. $value->id;
                        
                        $log->info("update section sql = $sql");
             
                        mysqli_query( $link, $sql ); 
                    } 
                }

                foreach($deletedSections as $key => $value){
                    $sql = "DELETE from sections Where id = $value ";
                    $log->info("Section delete sql = $sql");
                    mysqli_query( $link, $sql );
                }

                $log->info("infocard = $infocard");
                if(!empty($infocard)){

                    $sql="DELETE FROM infocard WHERE article_id=$article_id";
                    mysqli_query( $link, $sql );

                    $sql="INSERT INTO infocard(article_id, infocard) VALUES ($article_id, '$infocard')";
                    
                    $log->info("infocard insert sql = $sql");
                    mysqli_query( $link, $sql );
                }

                $response->message = "Article updated successfully!!!";
            }
            else{
                $response->success = false;
                $response->message = "Something went wrong. Please try again later.". mysqli_error($link);
            }
            mysqli_stmt_close($stmt);
        }
        else{
            $response->success = false;
            $response->message = "Error: " ."<br>" . mysqli_error($link);
        }
    }

	if($data->procedureName == "updateArticleStatus"){
        
        $id = $data->id;
        $slug = trim($data->slug);
        $status = $data->status;

        $sql="
        UPDATE articles SET 
        status=$status
        WHERE id = $id";

		$log->info("update sql = $sql");
         
        if($stmt = mysqli_prepare($link, $sql)){
            if(mysqli_stmt_execute($stmt)){
                
                $response->success = true;                
                $response->message = "Article status updated successfully!!!";
            }
            else{
                $response->success = false;
                $response->message = "Something went wrong. Please try again later.". mysqli_error($link);
            }
            mysqli_stmt_close($stmt);
        }
        else{
            $response->success = false;
            $response->message = "Error: " ."<br>" . mysqli_error($link);
        }
    }

    mysqli_close($link);
    echo json_encode($response);
}

if($_SERVER["REQUEST_METHOD"] == "GET"){
    $procedureName = $_GET['procedureName'];
    
    if($procedureName == "getAllCategories")
    {
        $sql = "SELECT id,category_name FROM categories";

        $result = mysqli_query( $link, $sql );  
        $row_cnt = $result->num_rows;
        
        if ($result) { 
            if($row_cnt > 0){
                while($row = $result->fetch_array(MYSQLI_ASSOC)) {
                        $myArray[] = $row;
                }
            
                $response->success = true;
                $response->data = $myArray;
                $response->message = "";
                $result->close();
            } 
            else 
            {            
                $response->success = false;
                $response->message = "No data available in table";
            }
        } 
        else {            
            $response->success = false;
            $response->message = "Error: " . $sql . "<br>" . mysqli_error($link);
        }
    }
		
    if($procedureName == "getAllArticles")
    {
		$pageno = $_GET['pageno'];
		$limit = $_GET['limit'];
		
		$start_from = ($pageno-1) * $limit;  

        $sql = "SELECT A.id, title, CONCAT(U.first_name ,' ',U.last_name) as user, C.category_name as category, description, 
        summary, banner, is_featured, slug, A.is_active, A.created_at 
        FROM articles A 
        inner join categories C on A.category_id = C.id
        inner join users U on A.user_id = U.id 
        WHERE type = 2
        ORDER BY id ASC LIMIT $start_from,$limit";
        
		$log->info("getAllArticles sql=.$sql");
        $result = mysqli_query( $link, $sql );  
        $row_cnt = $result->num_rows;
        
        if ($result) { 
            if($row_cnt > 0){
                while($row = $result->fetch_array(MYSQLI_ASSOC)) {
                        $myArray[] = $row;
                }
            
                $response->success = true;
                $response->data = $myArray;
                $response->message = "";
                $result->close();
            } 
            else 
            {            
                $response->success = false;
                $response->message = "No data available in table";
            }
        } 
        else {            
            $response->success = false;
            $response->message = "Error: " . $sql . "<br>" . mysqli_error($link);
        }
    }
    
    if($procedureName == "searchArticles")
    {
		$pageno = $_GET['pageno'];
		$limit = $_GET['limit'];
		$searchkey = $_GET['searchkey'];
		
		$start_from = ($pageno-1) * $limit;  

        $sql = "SELECT A.id, title, CONCAT(U.first_name ,' ',U.last_name) as user, C.category_name as category, description, summary, banner, is_featured, slug, A.is_active, A.created_at FROM articles A inner join categories C on A.category_id = C.id
        inner join users U on A.user_id = U.id 
        WHERE title like '%$searchkey%' and A.type = 2
        ORDER BY id ASC LIMIT $start_from,$limit";
        
		$log->info("searchArticles sql=.$sql");
        $result = mysqli_query( $link, $sql );  
        $row_cnt = $result->num_rows;
        
        if ($result) { 
            if($row_cnt > 0){
                while($row = $result->fetch_array(MYSQLI_ASSOC)) {
                        $myArray[] = $row;
                }
            
                $response->success = true;
                $response->data = $myArray;
                $response->message = "";
                $result->close();
            } 
            else 
            {            
                $response->success = false;
                $response->message = "No data available in table";
            }
        } 
        else {            
            $response->success = false;
            $response->message = "Error: " . $sql . "<br>" . mysqli_error($link);
        }
    }
		
    if($procedureName == "getArticleById")
    {
		$id = $_GET['id'];
		        
        $sql = "SELECT A.id, title, CONCAT(U.first_name ,' ',U.last_name) as user, C.category_name as category, description, summary, banner, is_featured, slug,  A.is_active, A.created_at FROM articles A inner join categories C on A.category_id = C.id
        inner join users U on A.user_id = U.id where A.id = $id and type = 2";

        $result = mysqli_query( $link, $sql );  
        $row_cnt = $result->num_rows;
        
        if ($result) { 
            if($row_cnt > 0){
                
                $row = mysqli_fetch_assoc($result);                                        
            
                $response->success = true;
                $response->data = $row;
                $response->message = "";
                $result->close();
            } 
            else 
            {            
                $response->success = false;
                $response->message = "No data available in table";
            }
        } 
        else {            
            $response->success = false;
            $response->message = "Error: " . $sql . "<br>" . mysqli_error($link);
        }
    }
    
    if($procedureName == "getTop6FeaturedArticles")
    {        
        $sql = "SELECT A.id, title, CONCAT(U.first_name ,' ',U.last_name) as user, C.category_name as category, description, summary, banner, is_featured,  slug,  A.is_active, A.created_at FROM articles A inner join categories C on A.category_id = C.id
        inner join users U on A.user_id = U.id where A.is_featured = 1 and A.status = 2 and A.type = 2";

        $result = mysqli_query( $link, $sql );  
        $row_cnt = $result->num_rows;
        
        if ($result) { 
            if($row_cnt > 0){
                while($row = $result->fetch_array(MYSQLI_ASSOC)) {
                    $myArray[] = $row;
                }
            
                $response->success = true;
                $response->data = $myArray;
                $response->message = "";
                $result->close();
            } 
            else 
            {            
                $response->success = false;
                $response->message = "No data available in table";
            }
        } 
        else {            
            $response->success = false;
            $response->message = "Error: " . $sql . "<br>" . mysqli_error($link);
        }
    }
    
    if($procedureName == "getTotalArticlesCount")
    {
        $sql = "SELECT count(id) FROM articles";

        $result = mysqli_query( $link, $sql );  
		$row_db = mysqli_fetch_row($result);  
		$total_records = $row_db[0];		

		$response->success = true;
		$response->data = $total_records;
		$response->message = "Count";
    }
    	
    if($procedureName == "getArticleBySlug")
    {
		$Slug = $_GET['slug'];
		        
        $sql = "SELECT A.id, title, CONCAT(U.first_name ,' ',U.last_name) as user,  A.category_id as category, description, summary, banner, is_featured, slug,  A.is_active, A.created_at 
        FROM articles A 
        inner join users U on A.user_id = U.id where A.Slug = '$Slug'";

	    //$log->info("sql=.$sql");
        $result = mysqli_query( $link, $sql );  
        $row_cnt = $result->num_rows;
        
        if ($result) { 
            if($row_cnt > 0){
                
                $row = mysqli_fetch_assoc($result);                                        
            
                $response->success = true;
                $response->data = $row;
                $response->message = "";
                $result->close();
            } 
            else 
            {            
                $response->success = false;
                $response->message = "No data available in table";
            }
        } 
        else {            
            $response->success = false;
            $response->message = "Error: " . $sql . "<br>" . mysqli_error($link);
        }
    }
    
    if($procedureName == "getArticleSectionsBySlug")
    {
		$Slug = $_GET['slug'];
		        
        $sql = "SELECT S.id, S.title, S.content as description, S.status
        FROM articles A 
        inner join sections S on S.article_id = A.id
        where A.Slug = '$Slug'";

	    //$log->info("sql=.$sql");
        $result = mysqli_query( $link, $sql );  
        $row_cnt = $result->num_rows;
        
        if ($result) { 
            if($row_cnt > 0){
                while($row = $result->fetch_array(MYSQLI_ASSOC)) {
                    $myArray[] = $row;
                }
            
                $response->success = true;
                $response->data = $myArray;
                $response->message = "";
                $result->close();
            }
            else 
            {            
                $response->success = false;
                $response->message = "No data available in table";
            }
        } 
        else {            
            $response->success = false;
            $response->message = "Error: " . $sql . "<br>" . mysqli_error($link);
        }
    }
    
    if($procedureName == "getArticleInfoCardBySlug")
    {
		$Slug = $_GET['slug'];
		        
        $sql = "SELECT I.infocard
        FROM articles A 
        inner join infocard I on I.article_id = A.id
        where A.Slug = '$Slug'";

	    //$log->info("sql=.$sql");
        $result = mysqli_query( $link, $sql );  
        $row_cnt = $result->num_rows;
        
        if ($result) { 
            if($row_cnt > 0){
               
                $row = mysqli_fetch_assoc($result);                                        
            
                $response->success = true;
                $response->data = $row;
                $response->message = "";
                $result->close();
            }
            else 
            {            
                $response->success = false;
                $response->message = "No data available in table";
            }
        } 
        else {            
            $response->success = false;
            $response->message = "Error: " . $sql . "<br>" . mysqli_error($link);
        }
    }
    
    // Close connection
    mysqli_close($link);
    echo json_encode($response->data);
}
?>