# Goods-Catalog
Online goods catalog build on NodeJS. My course project.
Database - MongoDB.
Main tools used:
- Pug
- JQuery
- WebSocket
- Mongoose
- Passport.js
- JWT auth
- Chart.js

# User roles
There are 3 types of user roles, except for an unauthorized users:
1. Basic
2. Admin
3. Owner

Here is the quick diagram of different users interaction, depending on their roles:
![image](https://drive.google.com/uc?export=view&id=1hYB9GG9BVHNs126ah8_g59mQWnKttcrU)

# Admininstrative panel
From there user, that, at least, have an admin role (or owner), can perform some managing actions such as adding items or updating existing and etc. Below is screenshot of how main page looks, if user authorized as admin:
![image](https://drive.google.com/uc?export=view&id=15OlD32JNIUmcrjLgO4DVxrplMKmz5ANJ)

# Real time charts (price diagrams)
If price of some item, that other user is currently watching in his browser, changes, price chart for this item in user's browser will be changed immediately.
Screenshot of item with its price diagram:
![image](https://drive.google.com/uc?export=view&id=1glOkCt_zVhqMqITSv7yDwE9Dq0Wpf-06)
