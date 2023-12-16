# Blog-Application Backend
- This repository covers the server side code for the blog application which means developing the APIs, retrieving data from the database efficiently.
- Use jwt library for tokenization in order to authenticate and authorize users so they can only do modifications such as performing CRUD operations to the blogs if and only if users can login to their account
  through their username and passoword.
- To check that CRUD operations work properly or not we add some unit tests with the help of Jest library with the help of testing database which I have defined solely for performing tests.
- We store password hash instead of password in the database with the help of bcrypt library in order maintain the privacy of user's account.
- Define middlewares in order to communicate data between one interface to another interfaces.
- Middlewares like tokenExtractor and userExtractor defined in the middlewares.js directory are very helpful in providing information about any user who make a request to the server in order to provide best
  experience.

### Installation
1. Clone the repository: `git clone https://github.com/Aarvs/full_stack_open_part-4.git`
2. Install dependencies: `npm install`

### Usage
```bash
npm run dev

### Contributing
1. Fork the repository
2. Create a new branch: `git checkout -b feature`
3. Make your changes and commit: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature`
5. Open a pull request

### Acknowledgements
- Thanks to full stack open for inspiratoin

### Contact
For questions or feedback, feel free to reach out to me at arnavsh2004@gmail.com
