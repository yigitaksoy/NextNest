![NextNest](https://github.com/yigitaksoy/NextNest/blob/master/client/public/nextnest-readme.png)

---
### About

NextNest is a personalized real estate notification service designed specifically to the dynamic Dutch real estate market. This tool is designed to keep users informed about the latest real estate listings in the Netherlands that match their preferences. By automating the search process and providing personalized notifications, NextNest takes the hassle out of finding the perfect property, allowing users to respond to new listings promptly as they become available.

The application checks for new property listings every 15 minutes and notifies registered users when a new listing matches their search criteria. Notifications are sent directly to the user's email to provide immediate updates.

### Tech

#### Frontend
- React
- React-Router
- Axios
- Firebase Auth
- React Firebase hooks
- React-Select
- TailwindCSS
- TailwindCSS/Forms
- DaisyUI
- Framer Motion
- Adobe Fonts
- Vite
#### Backend
- NodeJS
- Express
- MongoDB
- Firebase Admin SDK
- Puppeteer
- Mongoose
- Nodemailer
- Node-cron
- Better-queue


### Key Features

- **Authentication**: NextNest incorporates user registration and login functionalities with Google & E-mail signup, leveraging Firebase to ensure a personalized and secure user experience.

- **Secure User Verification**: NextNest utilizes Firebase Admin SDK for token verification. This ensures that all user tokens are validated prior to making any API call, thus enhancing security and preserving the integrity of user data.

- **API Handling**: By retrieving data from Dutch property websites, NextNest retrieves up-to-date real estate information. The NodeJS and Express backend manages API calls, data extraction, and storage, providing users with seamless interactions.

- **Scalable Data Management**: NextNest uses MongoDB to store and manage data, ensuring the app can handle growth without compromising speed or reliability. This ensures a consistently responsive, efficient, and user-friendly experience, even as the number of properties and user queries increases.

- **Automated Tasks**: Utilizing node-cron, NextNest executes its main data fetching function every 15 minutes. This ensures users receive the most current data without manual intervention.

- **Queue Management**: Utilizing better-queue, each fetch operation is added to the queue as a job, and jobs are processed in the order they were added (FIFO - First In, First Out). The queue then processes each job as resources allow, ensuring that no two fetch operations run concurrently. This significantly improves resource management and reliability of the application.

- **Personalized Search**: NextNest enables users to set their search parameters based on property type, location, price range, size, and more, offering a truly personalized experience. For those searching in Amsterdam, the application provides an additional feature to customize searches from 97 distinct neighborhoods.

- **Real-Time Notifications**: Registered users get immediate email notifications when a new listing matching their preferences is found. This feature eliminates the need for manual searching and gives instant access to new listings.

- **User Subscription Management**: NextNest allows users to manage their notification preferences easily. Users have the freedom to unsubscribe from the notification service at any time, offering full control over frequency of the notifications they receive.

- **Responsive and User-Friendly Interface**: The application's frontend, designed with React and TailwindCSS, delivers a responsive, pixel-perfect, and easy-to-navigate interface.

- **Custom Email Templates**: NextNest employs a pixel-perfect, responsive custom email template built with TailwindCSS & Adobe Fonts in Maizzle for its notification service. For more information, please see the template repo [here](https://github.com/yigitaksoy/Nextnest-email).

![Template Preview](https://github.com/yigitaksoy/Nextnest-email/blob/master/src/assets/images/nextnest-template.png)

### Disclaimer
NextNest is built as a personal side project, and it does not guarantee the accuracy, validity, or timeliness of the real estate listings information. Use it at your own discretion. NextNest is not affiliated with or endorsed by any real estate agencies or websites from which it retrieves the listings. NextNest is a free service and does not generate any income or profit.

### Contributing
Contributions, issues, and feature requests are welcome. Feel free to check the [issues page](https://github.com/yigitaksoy/NextNest/issues) if you want to contribute.
