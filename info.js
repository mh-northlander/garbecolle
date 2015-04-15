var infos=["輪に入らず一人で絵を描いていた",
           "輪に入らず一人で本を読んでいた",
           "\"魔法使い\"になった",
           "新興宗教に入信した",
           "友達ができなかった",
           "高校デビューに失敗した",
           "同人活動にハマった",
           "２浪した",
           "就職活動に失敗した",
           "留年した",
           "リストラされた"];

function createInfo(){
    return infos[Math.floor(Math.random()*infos.length)];
}
