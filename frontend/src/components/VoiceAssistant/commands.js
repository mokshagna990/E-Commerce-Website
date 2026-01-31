// commands.js
export const commands = {
  home: {
    keywords: ['home', 'go home', 'homepage'],
    path: '/',
    response: 'Going to home page'
  },
  cart: {
    keywords: ['cart', 'shopping cart', 'my cart'],
    path: '/cart',
    response: 'Opening cart'
  },
  login: {
    keywords: ['login', 'log in'],
    path: '/login',
    response: 'Taking you to login page'
  },
  googleLogin: {
    keywords: ['google login', 'login with google', 'google signin', 'sign in with google'],
    path: '/login',
    response: 'Taking you to Google login'
  },
  register: {
    keywords: ['register', 'sign up'],
    path: '/register',
    response: 'Taking you to registration page'
  },
  help: {
    keywords: ['help', 'commands', 'what can you do'],
    response: 'Available commands: home, cart, login, register, help'
  }
};

export const findCommand = (userInput) => {
  const input = userInput.toLowerCase();
  
  for (const [key, command] of Object.entries(commands)) {
    if (command.keywords.some(keyword => input.includes(keyword))) {
      return {
        type: key,
        ...command
      };
    }
  }
  
  return {
    type: 'unknown',
    response: "I didn't understand that. Try saying 'help' for available commands"
  };
};
