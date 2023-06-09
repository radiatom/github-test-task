import { ThunkDispatch } from "redux-thunk";
import { getDataClosedIssues, getDataOpenIssues } from "../api/api";
import {
  DataItemType,
  issuesCardType,
  setDataListType,
  initialStateType,
  setNameRepoType,
} from "../Types/types";

export const SET_DATA_LIST: string = "Reducer/SET_DATA_LIST";
export const setDataList = (res: Array<issuesCardType>): setDataListType => {
  return {
    type: SET_DATA_LIST,
    res: res,
  };
};

export const SET_NAME_REPO: string = "Reducer/SET_NAME_REPO";
export const setNameRepo = (owner: string, repo: string): setNameRepoType => {
  return {
    type: SET_NAME_REPO,
    owner: owner,
    repo: repo,
  };
};

export const initialState: initialStateType = {
  data: [],
  repoLink: {},
};

const Reducer = (
  state: initialStateType = initialState,
  action: setDataListType & setNameRepoType
) => {
  switch (action.type) {
    case SET_DATA_LIST:
      return {
        ...state,
        data: action.res,
      };
    case SET_NAME_REPO:
      return {
        ...state,
        repoLink: {
          owner: action.owner,
          repo: action.repo,
        },
      };
    default:
      return state;
  }
};

export const defoultStateResaults: any = {};

export const setListIssues =
  (owner: string, repo: string): any =>
  async (
    dispatch: ThunkDispatch<initialStateType, unknown, setDataListType>
  ) => {
    const repoFullName: string = `${owner}/${repo}`;

    if (defoultStateResaults.hasOwnProperty(repoFullName)) {
      dispatch(setDataList(defoultStateResaults[repoFullName]));
    } else {
      let id: number = 1;

      const dataIssue = await getDataOpenIssues(owner, repo);
      const issuesOpen: Array<DataItemType> = [];
      if (dataIssue !== undefined) {
        for (let a = 0; a < dataIssue.length; a++) {
          if (dataIssue[a].created_at === dataIssue[a].updated_at) {
            let obj: DataItemType = {
              id: id,
              title: dataIssue[a].title,
              number: dataIssue[a].number,
              created_at: dataIssue[a].created_at,
              login: dataIssue[a].user.login,
              comments: dataIssue[a].comments,
            };
            issuesOpen.push(obj);
            id++;
          }
        }
      }

      const issuesInProgress: Array<DataItemType> = [];
      if (dataIssue !== undefined) {
        for (let a = 0; a < dataIssue.length; a++) {
          if (dataIssue[a].created_at !== dataIssue[a].updated_at) {
            let obj: DataItemType = {
              id: id,
              title: dataIssue[a].title,
              number: dataIssue[a].number,
              created_at: dataIssue[a].created_at,
              login: dataIssue[a].user.login,
              comments: dataIssue[a].comments,
            };
            issuesInProgress.push(obj);
            id++;
          }
        }
      }

      const DataClosedIssues = await getDataClosedIssues(owner, repo);
      const issuesDone: Array<DataItemType> = [];
      if (DataClosedIssues !== undefined) {
        for (let a = 0; a < DataClosedIssues.length; a++) {
          let obj: DataItemType = {
            id: id,
            title: DataClosedIssues[a].title,
            number: DataClosedIssues[a].number,
            created_at: DataClosedIssues[a].closed_at,
            login: DataClosedIssues[a].user.login,
            comments: DataClosedIssues[a].comments,
          };
          issuesDone.push(obj);
          id++;
        }
      }

      const res: Array<issuesCardType> = [];
      const issuesOpenCard: issuesCardType = {
        id: 1,
        title: "ToDo",
        items: issuesOpen,
      };
      res.push(issuesOpenCard);
      const issuesInProgressCard: issuesCardType = {
        id: 2,
        title: "In Progress",
        items: issuesInProgress,
      };
      res.push(issuesInProgressCard);
      const issuesDoneCard: issuesCardType = {
        id: 3,
        title: "Done",
        items: issuesDone,
      };
      res.push(issuesDoneCard);

      const a = { [repoFullName]: res };
      Object.assign(defoultStateResaults, a);

      dispatch(setDataList(res));
    }
  };
export default Reducer;
