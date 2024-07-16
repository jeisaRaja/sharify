import { FC, ReactNode, createContext, useReducer } from "react";
import { Action } from "./Action";
import axios from "axios";

export type UserState = {
  user_id: string;
  username: string;
  profile_img: string;
  fullname: string;
  email: string;
};

export type Blog = {
  blog_id: string;
  _id: string;
  title: string;
  banner: string;
  content: string;
  tags: Array<string>;
  des: string;
  author: object;
  draft: boolean;
};

export type BlogState = Blog & {
  like: boolean;
};

export type EditorState = Blog & {
  loadDraftClicked: boolean;
};

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "LOGIN":
      return { ...state, user: action.payload };
    case "LOGOUT":
      return { ...state, user: null };
    case "UPDATE_BLOG":
      return { ...state, blog: action.payload };
    case "UPDATE_EDITOR":
      return { ...state, editor: action.payload };
    case "DELETE_BLOG":
      return { ...state, blog: null };
    case "DELETE_EDITOR":
      return { ...state, editor: null };
    case "TOGGLE_THEME":
      return {
        ...state,
        theme: state.theme === Theme.Dark ? Theme.Light : Theme.Dark,
      };
  }
}

function getTheme(): Theme {
  const value = localStorage.getItem("theme");
  let theme: Theme;
  if (value == "light") {
    theme = Theme.Light;
    localStorage.setItem("theme", "light");
  } else if (value == "dark") {
    theme = Theme.Dark;
  } else {
    theme = Theme.Light;
    localStorage.setItem("theme", "light");
  }
  document.body.classList.remove(Theme.Light, Theme.Dark);
  document.body.classList.add(theme);
  return theme;
}

enum Theme {
  Dark = "dark",
  Light = "light",
}

type AppState = {
  user: UserState | null;
  blog: BlogState | null;
  editor: EditorState | null;
  theme: Theme;
  toggleTheme: () => void;
  login: (user: UserState) => void;
  logout: () => void;
  updateBlog: (blog: BlogState) => void;
  getUserSessionData: () => void;
};

const initialState: AppState = {
  user: null,
  blog: null,
  editor: null,
  theme: getTheme(),
  toggleTheme: () => {},
  login: () => {},
  logout: () => {},
  updateBlog: () => {},
  getUserSessionData: () => {},
};

const useAppState = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  return { state, dispatch };
};

export const AppContext = createContext<AppState>(initialState);

interface AppContextProviderProps {
  children: ReactNode;
}

export const AppContextProvider: FC<AppContextProviderProps> = ({
  children,
}: AppContextProviderProps) => {
  const { state, dispatch } = useAppState();
  const login = (user: UserState) => {
    dispatch({ type: "LOGIN", payload: user });
  };

  const toggleTheme = () => dispatch({ type: "TOGGLE_THEME" });

  const logout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_ROUTE}/signout`,
        {},
        {
          withCredentials: true,
        },
      );
      console.log(response);
      dispatch({ type: "LOGOUT" });
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const updateBlog = (blog: BlogState) => {
    dispatch({ type: "UPDATE_BLOG", payload: blog });
  };

  async function getUserSessionData() {
    const response = await axios.get(
      `${import.meta.env.VITE_API_ROUTE}/session`,
      {
        withCredentials: true,
      },
    );
    if (response.status === 200) {
      login(response.data);
    }
  }

  return (
    <AppContext.Provider
      value={{
        ...state,
        login,
        updateBlog,
        getUserSessionData,
        logout,
        toggleTheme,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
