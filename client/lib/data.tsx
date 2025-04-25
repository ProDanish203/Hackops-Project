import {
  Archive,
  Blocks,
  LayoutDashboard,
  ListOrdered,
  NotebookPen,
  Settings,
  Users,
} from "lucide-react";

export const navLinks = [
  {
    name: "Dashboard",
    path: "/",
    icon: <LayoutDashboard className="text-text dark:text-darkText" />,
  },
  {
    name: "Orders",
    path: "/orders",
    icon: <ListOrdered className="text-text dark:text-darkText" />,
  },
  {
    name: "Categories",
    path: "/categories",
    icon: <Blocks className="text-text dark:text-darkText" />,
  },
  {
    name: "Products",
    path: "/products",
    icon: <Archive className="text-text dark:text-darkText" />,
  },
  {
    name: "Users",
    path: "/users",
    icon: <Users className="text-text dark:text-darkText" />,
  },
  // {
  //   name: "Settings",
  //   path: "/settings",
  //   icon: <Settings className="text-text dark:text-darkText" />,
  // },
];

export const products = [
  {
    title: "Adidas Shoes",
    price: "199",
    ratings: "4.5",
    itemsSold: "39",
    quantity: 10,
    img: "/images/shoe 1.jpg",
  },
  {
    title: "Nike Sneakers",
    price: "149",
    ratings: "4.2",
    itemsSold: "27",
    quantity: 10,
    img: "/images/shoe 2.jpg",
  },
  {
    title: "Puma Running Shoes",
    price: "129",
    ratings: "4.7",
    itemsSold: "56",
    quantity: 10,
    img: "/images/shoe 3.jpg",
  },
  {
    title: "Reebok Classic",
    price: "179",
    ratings: "4.4",
    itemsSold: "42",
    quantity: 10,
    img: "/images/shoe 4.jpg",
  },
  {
    title: "New Balance Sneakers",
    price: "139",
    ratings: "4.6",
    itemsSold: "33",
    quantity: 10,
    img: "/images/shoe 5.jpg",
  },
  {
    title: "Converse Chuck Taylor",
    price: "89",
    ratings: "4.3",
    itemsSold: "48",
    quantity: 10,
    img: "/images/shoe 6.jpg",
  },
  {
    title: "Vans Old Skool",
    price: "109",
    ratings: "4.8",
    itemsSold: "62",
    quantity: 10,
    img: "/images/shoe 7.jpg",
  },
  {
    title: "Adidas Superstar",
    price: "159",
    ratings: "4.5",
    itemsSold: "37",
    quantity: 10,
    img: "/images/shoe 1.jpg",
  },
  {
    title: "Nike Air Max",
    price: "179",
    ratings: "4.7",
    itemsSold: "51",
    quantity: 10,
    img: "/images/shoe 2.jpg",
  },
  {
    title: "Puma Suede",
    price: "119",
    ratings: "4.4",
    itemsSold: "45",
    quantity: 10,
    img: "/images/shoe 3.jpg",
  },
  {
    title: "Reebok Nano",
    price: "149",
    ratings: "4.6",
    itemsSold: "29",
    quantity: 10,
    img: "/images/shoe 4.jpg",
  },
];

export const productTableHeaders = [
  { name: "Product", key: "title" },
  { name: "Price", key: "price" },
  { name: "Quantity", key: "quantity" },
  { name: "Ratings", key: "ratings" },
  { name: "Items Sold", key: "itemsSold" },
  { name: "Actions", key: "actions" },
];

export const ordersTableHeaders = [
  { name: "Order ID", key: "orderId" },
  { name: "Customer", key: "customer" },
  { name: "Date", key: "date" },
  { name: "Amount", key: "amount" },
  { name: "Status", key: "status" },
  { name: "Actions", key: "actions" },
];

export const ordersData = [
  {
    orderId: "#1234",
    customer: "John Doe",
    date: "12/10/2021",
    amount: "$199",
    status: "Pending",
  },
  {
    orderId: "#1235",
    customer: "Jane Doe",
    date: "12/10/2021",
    amount: "$149",
    status: "Cancelled",
  },
  {
    orderId: "#1236",
    customer: "John Doe",
    date: "12/10/2021",
    amount: "$129",
    status: "Delivered",
  },
  {
    orderId: "#1237",
    customer: "Jane Doe",
    date: "12/10/2021",
    amount: "$179",
    status: "Delivered",
  },
  {
    orderId: "#1238",
    customer: "John Doe",
    date: "12/10/2021",
    amount: "$139",
    status: "Pending",
  },
  {
    orderId: "#1237",
    customer: "Jane Doe",
    date: "12/10/2021",
    amount: "$179",
    status: "Delivered",
  },
  {
    orderId: "#1238",
    customer: "John Doe",
    date: "12/10/2021",
    amount: "$139",
    status: "Delivered",
  },
  {
    orderId: "#1237",
    customer: "Jane Doe",
    date: "12/10/2021",
    amount: "$179",
    status: "Delivered",
  },
  {
    orderId: "#1238",
    customer: "John Doe",
    date: "12/10/2021",
    amount: "$139",
    status: "Delivered",
  },
];

export const orderDetailsHeaders = [
  { name: "Product", key: "product" },
  { name: "Unit Price", key: "unit-price" },
  { name: "Quantity", key: "quantity" },
  { name: "Total", key: "total" },
];

export const usersTableHeaders = [
  { name: "Name", key: "name" },
  { name: "Email", key: "email" },
  { name: "Phone", key: "phone" },
  { name: "Address", key: "address" },
  { name: "Date Joined", key: "dateJoined" },
  // { name: "Actions", key: "actions" },
];

export const usersData = [
  {
    name: "John Doe",
    image: "/images/dummy-user.webp",
    email: "john@gmail.com",
    phone: "+1234567890",
    address: "123, Lorem Ipsum, Dolor Sit, Amet",
    dateJoined: "12/10/2021",
  },
  {
    name: "John Doe",
    image: "/images/dummy-user.webp",
    email: "john@gmail.com",
    phone: "+1234567890",
    address: "123, Lorem Ipsum, Dolor Sit, Amet",
    dateJoined: "12/10/2021",
  },
  {
    name: "John Doe",
    image: "/images/dummy-user.webp",
    email: "john@gmail.com",
    phone: "+1234567890",
    address: "123, Lorem Ipsum, Dolor Sit, Amet",
    dateJoined: "12/10/2021",
  },
  {
    name: "John Doe",
    image: "/images/dummy-user.webp",
    email: "john@gmail.com",
    phone: "+1234567890",
    address: "123, Lorem Ipsum, Dolor Sit, Amet",
    dateJoined: "12/10/2021",
  },
  {
    name: "John Doe",
    image: "/images/dummy-user.webp",
    email: "john@gmail.com",
    phone: "+1234567890",
    address: "123, Lorem Ipsum, Dolor Sit, Amet",
    dateJoined: "12/10/2021",
  },
  {
    name: "John Doe",
    image: "/images/dummy-user.webp",
    email: "john@gmail.com",
    phone: "+1234567890",
    address: "123, Lorem Ipsum, Dolor Sit, Amet",
    dateJoined: "12/10/2021",
  },
];
