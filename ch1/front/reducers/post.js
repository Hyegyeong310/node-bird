export const initialState = {
  mainPosts: [
    {
      User: {
        id: 1,
        nickname: '베티'
      },
      content: 'first post',
      img:
        'https://images.unsplash.com/photo-1513360371669-4adf3dd7dff8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60'
    }
  ],
  imagePaths: []
};

export const ADD_POST = 'ADD_POST';
export const ADD_DUMMY = 'ADD_DUMMY';

export const addPost = data => ({
  type: ADD_POST,
  data
});

export const addDummy = {
  type: ADD_DUMMY,
  data: {
    content: 'Hello',
    UserId: 1,
    User: {
      nickname: 'betty'
    }
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_POST:
      return { ...state, mainPosts: [action.data, ...state.mainPosts] };
    case ADD_DUMMY:
      return { ...state, mainPosts: [action.data, ...state.mainPosts] };
    default:
      return state;
  }
};

export default reducer;
