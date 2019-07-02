## Start Minio S3 Storage
docker run -p 9000:9000 -d --name minio-server -e MINIO_ACCESS_KEY=admin -e MINIO_SECRET_KEY=password minio/minio server /data

# Create bucket and sample data
mc config host add local http://localhost:9000 admin password
mc mb local/warehousedev
mc cp --recursive minio/ local/warehousedev

# Test the auto update endpoint
curl http://localhost:3000/autoupdate/v1/warehousedev/abcd1234/list.txt
