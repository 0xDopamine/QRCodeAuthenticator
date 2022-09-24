# QRCodeAuthenticator

 An authentication app using QR Codes.
 
 We're all familiar with logging in using QR Codes in various apps, it's simple, effective and secure. And also really interesting.
 So out of curiousity I decided to make my own authentication app using QR Codes.
 
First of all we need to create a user, on the /register page.

 <img width="1186" alt="Screen Shot 2022-09-24 at 3 03 46 AM" src="https://user-images.githubusercontent.com/90485728/192076122-23840612-fdd9-4894-bf13-540033d19915.png">

As you see at the response a jwt token for the user was created, and user info is saved into the database.
<img width="743" alt="Screen Shot 2022-09-24 at 3 04 41 AM" src="https://user-images.githubusercontent.com/90485728/192076259-8d6b6f2b-d4ac-4fab-aee5-873a0b1db7b6.png">


Great! Now moving on to the login page, using the previous infos we generate a login token (as seen bellow)

<img width="1216" alt="Screen Shot 2022-09-24 at 3 08 32 AM" src="https://user-images.githubusercontent.com/90485728/192076278-c9ca3538-8e9c-4faa-9892-1cec21400eff.png">

So now we created a user and logged in to that user account, and here comes the cool part.
In order for us to generate a QR Code, we need the user ID (the index to that user in the database) and the login token we received when we logged in.

<img width="1217" alt="Screen Shot 2022-09-24 at 3 09 36 AM" src="https://user-images.githubusercontent.com/90485728/192076338-d31865f5-fc52-4c5d-bfbc-8630e77d0afa.png">

The QR Code is returned as a base64 string, and the infos related to it are stored in the database:

<img width="736" alt="Screen Shot 2022-09-24 at 3 17 11 AM" src="https://user-images.githubusercontent.com/90485728/192076554-dbde925d-2e03-40bb-9865-92872ee7a919.png">

After decoding the base64 string the QR Code image is shown:

<img width="1037" alt="Screen Shot 2022-09-24 at 3 10 58 AM" src="https://user-images.githubusercontent.com/90485728/192076403-e5ae3f1a-0771-4a7c-a063-df957be75e90.png">

Then we scan it..

<img width="567" alt="Screen Shot 2022-09-24 at 3 42 01 AM" src="https://user-images.githubusercontent.com/90485728/192076748-7938e56d-bb04-4584-8b02-977e43cc0eba.png">


Now, to login using the QR Code we'll be needing the token encrypted in the image, and the device information.
<img width="1211" alt="Screen Shot 2022-09-24 at 3 15 47 AM" src="https://user-images.githubusercontent.com/90485728/192076608-13b22f74-8d06-47fd-a7a5-4cecefa15453.png">

The device infos are stored in the database:
<img width="743" alt="Screen Shot 2022-09-24 at 3 17 25 AM" src="https://user-images.githubusercontent.com/90485728/192076662-11c09f95-8be0-4c82-af4e-8a6d312fdf77.png">

And the token returned will be used to login!

Thank you for checking out my project! If you have any feedback, feel free.


