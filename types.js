const types = `
type Query {
    menu(idmenu: Int, menu_name: String): [menu!]!,
    search_sentence: [search_sentence!]!,
    shop(idshop: Int, shop_name: String): [shop!]!,
    shop_menu: [shop_menu!]!,
    User: [User!]!
}

type menu {
    idmenu:    Int         
    menu_name: String     
    shop_menu: shop_menu!
  }
  
  type search_sentence {
    date_time: String
    id:        Int       
    sentence:  String
  }
  
  type shop {
    idshop:     Int         
    shop_addr:  String
    shop_name:  String
    shop_order: Int      
    shop_phone: String
    shop_menu:  shop_menu!
  }
  
  type shop_menu {
    id:      Int  
    menu_id: Int
    shop_id: Int
    menu:    menu!
    shop:    shop! 
  }
  
  type User {
    id:       Int     
    password: String
    username: String
  }

  input CreateUserInput {
    username: String!
    password: String!
}

input CreateShopInput {
  shop_addr:  String
  shop_name:  String
  shop_order: Int      
  shop_phone: String
}

input shopWhereUniqueInput {
  idshop:     Int 
}

input MenuShopInput {
  menu_name:  String!
  idshop: Int!
}

input MenuDeleteInput {
  shop_id: Int!
  menu_id: Int!
}

type menuWhereUniqueInput {
  shop_menu: shop_menu!
}

type shop_menuCreateInput {
  shop: shop!
  menu: menu!
}

type Mutation {
    createUser(data: CreateUserInput!): AuthPayload!
    login(where: CreateUserInput!): AuthPayload!
    deleteUser: User!
    createShop(data: CreateShopInput!): shop!
    updateShop(data: CreateShopInput!, where: shopWhereUniqueInput!): shop!
    deleteShop(where: shopWhereUniqueInput!): shop!
    addMenu(data: MenuShopInput!): MenuPayload!
    deleteMenu(where: MenuDeleteInput!): shop_menu!
    getMenu(where: menuGetUniqueInput): [menu!]!
}
type shop_menuWhereInput{
  shop_menu: shop_menu!
}
input menuGetUniqueInput {
  shop_id: Int!
}

type MenuPayload {
  menu: menu!
}

type AuthPayload {
  token: String!
  user: User!
}
`;

module.exports.types = types;