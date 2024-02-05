export interface Product {
    product_id: number;
    name: string;
    description: string;
    category: {
        id: number;
        name: string;
    };

    price: number;
    image_url: string;
    // add other properties as needed
}