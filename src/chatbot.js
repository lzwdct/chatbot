const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
const { shuffleArray } = require('../util');

class Chatbot{
    async chat(content){
        const words = content.split(" ");
        const [shop] = await Promise.all(words.map(async (word) => {
            const data = await this.getShopByName(word);

            if(data.length === 1){
                const {shop_name, shop_addr, shop_phone} = data[0];

                if((content.indexOf("메뉴") > -1)){
                    return await this.getMenuListByShopName(shop_name);
                }else if((content.indexOf("주소") > -1)){
                    return `${shop_name} 의 주소 및 전화번호\n${shop_addr}\n${shop_phone}`;
                }else{
                    return [
                    `${shop_name} 주소`,
                    `${shop_name} 메뉴`
                    
                    ]
                }
            }else if(data.length > 1){
                if((content.indexOf("메뉴") > -1)){
                    return await this.getMultipleShopDetail(data, 1);
                }
                return await this.getMultipleShopDetail(data);
            }
        }));

        if(shop){
            return shop;
        }

        const [menu] = await Promise.all(words.map(async (word) => {
            if(!(word.indexOf("@") > -1)){
                const menuSearch = await this.getMenu(word);

                if( menuSearch.length > 1){
                    return this.getMultipleMenuList(menuSearch, 1);
                }else if(menuSearch.length === 1){
                    return this.getShopListSearchByMenuName(menuSearch[0].menu_name)
                }
            }else{
                const newWord = word.replace('@','');
                const shopList = await this.getShopListSearchByMenuName(newWord);

                if(shopList.length){
                    return await this.getMultipleShopDetail(shopList);
                }
            }
        }));

        if(menu){
            return menu;
        }

        return `식당 또는 메뉴가 검색되지 않았습니다.`;
        
    }

    async getShopListSearchByMenuName(name){
        const menus = await prisma.menu.findMany({
            where : {
                menu_name : name
            },
            include : {
                shop_menu : true
            }
        });
        
        const menusList = menus[0].shop_menu;

        let result = await Promise.all(menusList.map(async (item) => {
            const shop = await prisma.shop.findMany({
                where : {
                    idshop : item.shop_id
                }
            })
            return shop[0];
        }))

        result = shuffleArray(result);
        result = result.sort(function (a, b) {
            return a.shop_order > b.shop_order ? 1 : -1;
        });

        return result
    }
    async getMenuListByShopName(shop_name){
        const shops = await prisma.shop.findMany({
			where : {
				shop_name : {
					contains: shop_name
				}
			},
			include : {
				shop_menu : true
			}
		});

		const menuList = shops[0].shop_menu;
		const result = await Promise.all(menuList.map(async (item) => {
			const menus = await prisma.menu.findMany({
				where : {
					idmenu : item.menu_id
				},
				select : {
					menu_name : true
				}
			})

			return menus[0].menu_name
        }))
        
        return result.join("\n");
        
    }
    async getShopByName(item){
        return await prisma.shop.findMany({
            where : {
                shop_name : {
                    contains: item
                }
            }
        })
    }
    async getMenu(item){
        return await prisma.menu.findMany({
            where : {
                menu_name : {
					contains: item
				}
            }
		});
    }
    
    async getMultipleShopDetail(shops, isMenu = 0){
        if(isMenu)
            return await shops.map(shop => shop.shop_name + ' 메뉴');

        return await shops.map(shop => shop.shop_name);
    }
    getMultipleMenuList(menus, returnType){
        if(returnType)
        return menus.map(menu => '@'+menu.menu_name);

        return menus.map(menu => menu.menu_name);
    }
    async getMenuByName(text){
        const result = await Promise.all(text.map(async (item) => {
			const menu = await this.getMenu(item);

            if (menu.length > 1) {
                let menus = [];
                for(let i = 0; i < menu.length; i++){
                    let {menu_name} = menu[i];
                    menus.push(`${menu_name} 검색`);
                }
                const nameSearchText = item + ' 검색';
                if(menus.includes(nameSearchText)){
                    menus.splice(menu.indexOf(nameSearchText), 1);

                    menus = shuffleArray(menu);

                    return [
                        nameSearchText,
                        ...menu
                    ]
                }else{
                    menu = shuffleArray(menu);
                }
            }else if(menu.length === 1){
                const menus = await prisma.menu.findMany({
                    where : {
                        menu_name : item
                    },
                    include : {
                        shop_menu : true
                    }
                });
    
                const shop = await prisma.shop.findMany({
                    where : {
                        idshop : menus[0].shop_menu[0].shop_id
                    }
                })
                return shop[0]
                
            }
        }))

        return result;

        
    }
    
}

exports.Chatbot = Chatbot;
