const todosData = {};

// FOR POST
const validUserSignup1 = {
    firstname: 'Aphrodice',
    lastname: 'Izabayo',
    email: 'izabayoaphrodice@gmail.com',
    password: 'password1'
};
const validUserSignin1 = {
    email: 'izabayoaphrodice@gmail.com',
    password: 'password1'
};
const validTodo = {
    title: 'Code',
    description: 'Today, I will be writing tests'
};
const validTodo2 = {
    title: 'Eat',
    description: 'I will go to the restaurant'
};
const invalidTodo1 = {
    description: 'Task description'
};
const invalidTodo2 = {
    title: 'title1'
};
const taskNotFound = {
    userid: '2fc2ef78-1879-4c9b-822f-3345aab4c710',
    taskid: 'bac0c45e-752f-425d-9fbf-2af73e64ffb0',
    createdon: '2019-11-20T14:41:21.778Z',
    title: 'Task 1',
    description: 'Task description'
};
const invalidUpdate = {
    description: 'Go to play football'
};
const invalidUpdate2 = {
    title: 'Pray'
};
const updateTodo = {
    title: 'Updated title',
    description: 'Updated description'
};

todosData.validUserSignup1 = validUserSignup1;
todosData.validUserSignin1 = validUserSignin1;
todosData.validTodo = validTodo;
todosData.validTodo2 = validTodo2;
todosData.invalidTodo1 = invalidTodo1;
todosData.invalidTodo2 = invalidTodo2;
todosData.taskNotFound = taskNotFound;
todosData.invalidUpdate = invalidUpdate;
todosData.invalidUpdate2 = invalidUpdate2;
todosData.updateTodo = updateTodo;

export default todosData;
