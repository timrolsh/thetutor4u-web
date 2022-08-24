docker stop thetutor4u-db;
docker rm thetutor4u-db;
docker image rm thetutor4u-db-image;
Write-Output "Removed old container and image.";
Write-Output "Creating new image...";
docker build -t "thetutor4u-db-image" .;
docker run --name thetutor4u-db -d -p 5432:5432 thetutor4u-db-image;
Start-Sleep -Seconds 1;
docker exec thetutor4u-db psql -d postgres -f /script/init_db.sql;
Write-Output "Successfully created new container and image. ";

