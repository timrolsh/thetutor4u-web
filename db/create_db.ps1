$delete = Read-Host "Remove old container and image? (y/n)";
if ($delete.Equals("y")) {
    docker stop thetutor4u-db;
    docker rm thetutor4u-db;
    echo "Removed old container and image.";
}
$new = Read-Host "Create new container and image? (y/n)";
if ($new.Equals("y")) {
    echo "Creating new image...";
    docker build -t "thetutor4u-db-image" .;
    docker run --name thetutor4u-db -d -p 5432:5432 thetutor4u-db-image;
    Start-Sleep -Seconds 1;
    docker exec thetutor4u-db psql -d postgres -f /script/init_db.sql;
    echo "Successfully created new container and image. ";
}
