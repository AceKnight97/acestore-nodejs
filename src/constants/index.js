const QUERIES = `

query{
  users{
    id
    username
    email
    signUpDate
    isVerified
  }
}

query {
  insight(from:"1/06/2021", to: "10/07/2021"){
    id
    date
    income
    notes
    logs {
      title
      money
      details
    }
  }
}

query {
  dailyInfo(date:"10/06/2021"){
    id
    date
    income
    notes
    logs {
      title
      money
      details
    }
  }
}


`;

const MUTATIONS = `

mutation{
  signUp(username:"ace5",
  email: "ace5@gmail.com",
    password:"123456789"
  ){
    token
    isSuccess
  }
}

mutation{
  signIn(username: "ace1", password: "123456789"){
    token
  }
}

mutation {
  addDailyInfo(input:{
    date: “10/06/2021”,
    logs:[
    {
      title: "Ace",
      money: 12.12,
      details: "test1",
    },
    ],
    income: 13.13,
    notes: "test2",
  }){
    isSuccess
    message
  }
}

mutation {
  updateLogs(input:{
    id: "60c1c0902df3e84d96f6bf1e",
    logs: [
      {
        title: "Nice",
        money:123,
        details: "Nothing",
      },
    ],
  }){
    isSuccess
    message
  }
}

`;

const Token = `
{
  "access-token":

}
`;

const ALL_SUBSCRIPTIONS = {
  NEW_FOOD_ORDER: "NEW_FOOD_ORDER",
};

module.exports = { ALL_SUBSCRIPTIONS };
