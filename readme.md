# How to start the project

## Add Dependencies


### Website (lv_pap)
```
npm install
composer update
```

### App (rn_pap)
```
npm install
```

# Start Laravel

```
cd lv_pap

php artisan migrate
php artisan migrate:fresh --seed
php artisan serve --host {your_ip_adress} --port 8000
php artisan reverb:start

npm run dev
```

# Start React Native

```
cd rn_pap

npm start --reset-cache
```

# Configs when running localy

- Make shure to change in the rn_pap/setup.tsx the **appUrl** addres for the {your_ip_adress} used when starting the Laravel application!

# Project Readmes

## [Laravel](lv_pap/README.md)
## [React Native](rn_pap/README.md)
