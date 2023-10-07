import mongoose from "mongoose";

const userModel=mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true},
    password:{type:String,required:true},
    picture:{type:String,default:"https://www.bing.com/images/search?view=detailV2&ccid=f3DM2upC&id=BE9544E0B26321595FC05E41DD7A8D2D8409905E&thid=OIP.f3DM2upCo-p_NPRwBAwbKQHaHa&mediaurl=https%3a%2f%2fstatic.vecteezy.com%2fsystem%2fresources%2fpreviews%2f000%2f574%2f512%2foriginal%2fvector-sign-of-user-icon.jpg&exph=5000&expw=5000&q=stockimage+user&simid=608016161024725436&FORM=IRPRST&ck=AEB76D437BCF4BF5487955019143A316&selectedIndex=21"}

},
{
    timestamps:true,
    
}
)

export const User=mongoose.model("User", userModel)