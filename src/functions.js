export function Split_Tokens(data)
{
    let tokens = data.split(",");
    return tokens;
}

export function Decode_Token(access_token)
{
    let feilds = access_token.split('.');
    let body = atob(feilds[1]);
    const jsObject = JSON.parse(body);
    return jsObject;
}

export function Handle_Tokens(data)
{
    let [access_token, refresh_token] = Split_Tokens(data);
    
    let body = Decode_Token(access_token)
    //console.log(body.uid)

    sessionStorage.setItem("accessToken",access_token);
    sessionStorage.setItem("refreshToken",refresh_token);
    sessionStorage.setItem("user_id", body.uid)
}

export function Validate_Email(email)
{
    let message = "";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email))
    {
        message = "Email invalid";
    }

    return message;
}
export function Validate_Password(password)
{
    let message = "";
    if(password.length < 10)
    {
        message = "Password too short";
    }   
    
    if(password.length > 30)
    {
        message = "Password too long";
    }

    return message;
}