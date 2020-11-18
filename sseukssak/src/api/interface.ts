export interface DirState {
    restoreMoveList: RestoreMoveListUnit[]
    fromDir: string;
    fileList: string[];
    fileSortList: SortList;
    toLibraryList: ToLibrary[];
    toLibraryNameList: string[];
    selectedToName: string;
    logBackCheck: boolean;
    duplicatedList: [][];
    dropToDir: string;
    modifyDirectroy: ToLibraryDirectory;
    renameHistory: any[][];

    moveHistory: any[][];
    renameFileList: FileInfo[];
    beforeItems: FileInfo[];
    afterItems: FileInfo[];
    filterFront: string;
    filterMiddle: string;
    filterBack: string;
    dupCheck: string[];
    frontName: string;
    middleName: string;
    backName: string;


    // Google Auth
    tokenPath: string;
    oAuth2Client: any;
}
export interface RestoreMoveListUnit {
    type: string;
    from: string;
    to: string;
}
export interface ToLibrary {
    name: string;
    directories: ToLibraryDirectory[];
}
export interface ToLibrary2 {
    name: string;
    directories: ToLibraryDirectory2[];
}
export interface ToLibraryDirectory {
    path: string;
    typeTags: string[];
    dateTags: string[];
    titleTags: string[];
    aiTags: string[];
}export interface ToLibraryDirectory2 {
    path: string;
    typeTags: string[];
    dateTags: string[];
    titleTags: string[];
    aiTags: string[];
    types: string[]
}
export interface SortList {
    directories: Directory[];
    files: FileUnit[];
}
export interface FileUnit {
    fileType: string;
    birthTime: number;
    updatedTime: number;
    icon: string;
    name: string;
}
export interface Directory {
    name: string;
    birthTime: number;
    updatedTime: number;

}
export interface FileInfo {
    name: string;
    path: string;
    ctime: Date;
    mtime: Date;
    type: string;
    dir: string;
}
