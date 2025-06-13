const GlobalVariables = {
    Client_URL : '',
    Login_Username : '',
    USER_NAME : '',
    EMP_NO : '',
    EMP_IMAGE_BASE64 : '',
    CompanyCode : '',
    BranchCode : '',
    CompanyName : '',
    doConnectionParameter : '',
    CurrentOfcLocation : '',
    AndroidID : '',
};

export default GlobalVariables;

export function resetGlobalVariables() {
    GlobalVariables.Client_URL = '';
    GlobalVariables.Login_Username = '';
    GlobalVariables.USER_NAME = '';
    GlobalVariables.EMP_NO = '';
    GlobalVariables.EMP_IMAGE_BASE64 = '';
    GlobalVariables.CompanyCode = '';
    GlobalVariables.BranchCode = '';
    GlobalVariables.CompanyName = '';
    GlobalVariables.doConnectionParameter = '';
}