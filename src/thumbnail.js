class Thumbnail{
    getRandomThumbnail(){
        const images = [
            "https://auckland-shop-admin.s3.ap-southeast-2.amazonaws.com/images/chatbot.jpg",
            "https://auckland-shop-admin.s3-ap-southeast-2.amazonaws.com/images/bab.png",
            "https://auckland-shop-admin.s3-ap-southeast-2.amazonaws.com/images/bibim.png",
            "https://auckland-shop-admin.s3-ap-southeast-2.amazonaws.com/images/hwe.jpg",
            "https://auckland-shop-admin.s3-ap-southeast-2.amazonaws.com/images/jogi.png"
        ];

        return images[Math.floor(Math.random() * images.length)];
    }
    
    
}

exports.Thumbnail = Thumbnail;