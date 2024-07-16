import { BlogState, EditorState, UserState } from "./State";

export type LoginAction = {
  type: "LOGIN";
  payload: UserState;
};

export type LogoutAction = {
  type: "LOGOUT";
};

export type UpdateBlogAction = {
  type: "UPDATE_BLOG";
  payload: BlogState;
};

export type DeleteBlogAction = {
  type: "DELETE_BLOG";
};

export type UpdateEditorAction = {
  type: "UPDATE_EDITOR";
  payload: EditorState;
};

export type DeleteEditorAction = {
  type: "DELETE_EDITOR";
};

export type ToggleThemeAction = {
  type: "TOGGLE_THEME";
};

export type Action =
  | LoginAction
  | LogoutAction
  | UpdateBlogAction
  | UpdateEditorAction
  | DeleteBlogAction
  | DeleteEditorAction
  | ToggleThemeAction;
