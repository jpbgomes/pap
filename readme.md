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


### Project Description

The idea of the project is the creation of an application and a website for both sighted and visually impaired runners. All users will be able to access the application as guests. To interact with other users, events and groups, registration on the platform will be required. 

When registering as a runner, information such as running ability, health, the district they belong to, and the districts they are interested in receiving news about will be requested. After registration, the runner will have access to different groups, individuals, and events that fit within the selected filters. 

Since some runners are visually impaired, they will require some type of filter suitable for the available groups and events, and they will always need a guide. 
