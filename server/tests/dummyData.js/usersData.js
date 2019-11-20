const usersInfo = {};

// FOR SIGNUP
const validUserSignup = {
    firstname: 'Aphrodice',
    lastname: 'Izabayo',
    email: 'izabayoaphrodis@gmail.com',
    password: 'password'
};

const invalidUserSignup = {
    lastname: 'Izabayo1',
    email: 'izabayoaphrodis1@gmail.com',
    password: 'password1'
};

const emailExists = {
    firstname: 'firstname',
    lastname: 'lastname',
    email: 'izabayoaphrodis@gmail.com',
    password: 'password2'
};
const noPassword500 = {
    firstname: 'first',
    lastname: 'last',
    email: 'email@gmail.com'
};
// FOR SIGNIN
const emailNotFound = {
    email: 'aphrodice@kepler.org',
    password: 'password'
};
const incorrectPassword = {
    email: 'izabayoaphrodis@gmail.com',
    password: 'wrongpassword'
};
const validUserSignin = {
    email: 'izabayoaphrodis@gmail.com',
    password: 'password'
};
const server500Error = {
    email: 'izabayoaphrodis@gmail.com'
};


usersInfo.validUserSignup = validUserSignup;
usersInfo.invalidUserSignup = invalidUserSignup;
usersInfo.emailExists = emailExists;
usersInfo.noPassword500 = noPassword500;
usersInfo.emailNotFound = emailNotFound;
usersInfo.incorrectPassword = incorrectPassword;
usersInfo.server500Error = server500Error;
usersInfo.validUserSignin = validUserSignin;

export default usersInfo;
