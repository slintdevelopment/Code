

interface User {
   username: string;
   tag: string;
   email: string;
   pfp: string
}

interface Friend {
   username: string;
   tag: string;
   email: string;
   pfp: string;
   ref: string;
}

export { User, Friend }
