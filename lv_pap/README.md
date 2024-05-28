# Run Project

- Run Laravel Project after the migrations and seeders in the correct IP and PORT

```
php artisan migrate:fresh --seed
php artisan serve --host {your_ip_adress} --port 8000
php artisan reverb:start
```

# Clear Cache

```
php artisan optimize
```