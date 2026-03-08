export interface Product {
  id: string;
  name: string;
  priceText: string;
  imageUrl: string;
  tiktokUrl: string;
  rating: number;
  category: string;
  sales: number;
  salesPerDay: number;
  viralScore: number;
  margin: number;
  commission: number;
  concurrency: 'Baixa' | 'Média' | 'Alta';
  deliveryTime: string;
  supplierRating: number;
  estimatedProfit?: string;
  trend?: string;
  icon?: string;
  tags?: string;
  description?: string;
  estimatedViews?: string;
  estimatedOrders?: number;
}

export interface DashboardStats {
  faturamento: string;
  pedidos: number;
  comissao: string;
  produtosAtivos: number;
  chartData: { month: string; vendas: number }[];
}

export interface UserProfile {
  name: string;
  email: string;
  avatar: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

export const PRODUCTS_SEED: Product[] = [
  {
    id: "cinto-tachas-punk",
    name: "Cinto com tachas pretas cinto de punk rock com rebites com piramide de metal brilhante para unissex",
    priceText: "R$ 32,98",
    imageUrl: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/3fbdd9e221ed4405a41bcdfe025b6344~tplv-aphluv4xwc-crop-webp:300:300.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1731420019843958035",
    rating: 4.9,
    category: "Acessórios",
    sales: 8500,
    salesPerDay: 45,
    viralScore: 88,
    margin: 35,
    commission: 15,
    concurrency: 'Média',
    deliveryTime: '7-12 dias',
    supplierRating: 4.8
  },
  {
    id: "barriguinha-cream",
    name: "Barriguinha Cream 200g Creme para Hidratação Profunda",
    priceText: "R$ 136,00",
    imageUrl: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/9014652732064d459b29f56ef1f89438~tplv-aphluv4xwc-resize-webp:800:800.webp?dr=15584&t=555f072d&ps=933b5bde&shp=6ce186a1&shcp=607f11de&idc=my2&from=1826719393",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1731351465671230649",
    rating: 4.8,
    category: "Skincare",
    sales: 12000,
    salesPerDay: 120,
    viralScore: 95,
    margin: 42,
    commission: 20,
    concurrency: 'Alta',
    deliveryTime: '3-5 dias',
    supplierRating: 4.9
  },
  {
    id: "descascador-alho-silicone",
    name: "1Pc Descascador De Alho Silicone Rolo Moedor Chopper Máquina Acessórios Para Cozinhar Cozinha Mini Imprensa Ferramentas",
    priceText: "R$ 37,00",
    imageUrl: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/4e5ad1a12a9c46e397139643ca501ab0~tplv-o3syd03w52-crop-webp:300:300.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1732147487806556159",
    rating: 4.8,
    category: "Casa & Cozinha",
    sales: 5400,
    salesPerDay: 32,
    viralScore: 75,
    margin: 28,
    commission: 12,
    concurrency: 'Baixa',
    deliveryTime: '10-15 dias',
    supplierRating: 4.5
  },
  {
    id: "conjunto-top-saia-sereia",
    name: "Conjunto Top Decotado Manga Cavada + Saia Longa Com Fenda Sereia Moda Feminina Confortável Elegante Festas Praia Natal",
    priceText: "R$ 62,71",
    imageUrl: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/ba79d680a3464e3e81261fbeae6d1610~tplv-o3syd03w52-crop-webp:300:300.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1732767996168406714",
    rating: 4.3,
    category: "Moda",
    sales: 3200,
    salesPerDay: 28,
    viralScore: 82,
    margin: 40,
    commission: 18,
    concurrency: 'Média',
    deliveryTime: '5-8 dias',
    supplierRating: 4.2
  },
  {
    id: "kit-2-bermudas-tactel",
    name: "Kit 2 Bermudas Tactel Preta e Branca Bolsos Laterais Short Moda Praia Verão",
    priceText: "R$ 46,31",
    imageUrl: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/dd7fef17a8144beb860b2471376e7b75~tplv-o3syd03w52-crop-webp:300:300.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1732706501926750064",
    rating: 4.4,
    category: "Moda",
    sales: 6700,
    salesPerDay: 55,
    viralScore: 79,
    margin: 32,
    commission: 14,
    concurrency: 'Média',
    deliveryTime: '4-7 dias',
    supplierRating: 4.6
  },
  {
    id: "kit-4-toalhas-banho",
    name: "Kit 4 Toalha de Banho Grande e Grossa Premium Luxo Felpuda 100% Algodão Viena",
    priceText: "R$ 54,40",
    imageUrl: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/cd7420e061484c7198942872f8e33484~tplv-aphluv4xwc-crop-webp:300:300.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1732917888887194947",
    rating: 5.0,
    category: "Casa & Cozinha",
    sales: 15000,
    salesPerDay: 140,
    viralScore: 98,
    margin: 25,
    commission: 10,
    concurrency: 'Baixa',
    deliveryTime: '3-6 dias',
    supplierRating: 5.0
  },
  {
    id: "mini-liquidificador-portatil",
    name: "Mini Liquidificador Portátil Recarregável 450ml 8 Lâminas Espremedor USB Display Digital Multifuncional Suco Smoothie Prático e Saudável",
    priceText: "R$ 41,57",
    imageUrl: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/2ae85e37cfd14759887abc95f7395b6d~tplv-aphluv4xwc-crop-webp:300:300.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1731172576541443502",
    rating: 4.0,
    category: "Eletrônicos",
    sales: 4200,
    salesPerDay: 35,
    viralScore: 85,
    margin: 30,
    commission: 15,
    concurrency: 'Média',
    deliveryTime: '8-12 dias',
    supplierRating: 4.1
  },
  {
    id: "azeiteiro-vinagreiro-spray",
    name: "Azeiteiro Vinagreiro Spray De Vidro Com Botao + Bico Dosador + Tampa E Alca De Plastico 470ml",
    priceText: "R$ 29,69",
    imageUrl: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/07fc9c6501d546dea59b9a832137f133~tplv-o3syd03w52-crop-webp:300:300.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1731518860899616510",
    rating: 4.3,
    category: "Casa & Cozinha",
    sales: 2800,
    salesPerDay: 22,
    viralScore: 72,
    margin: 35,
    commission: 12,
    concurrency: 'Baixa',
    deliveryTime: '7-10 dias',
    supplierRating: 4.4
  },
  {
    id: "saia-box-cama",
    name: "Saia para Box Cama Solteiro/Casal/Queen Micropercal - Com Elástico",
    priceText: "R$ 18,59",
    imageUrl: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/1204d72cee654efb98b21d265ea33c51~tplv-aphluv4xwc-crop-webp:300:300.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1733041675376232147",
    rating: 4.6,
    category: "Casa & Cozinha",
    sales: 9200,
    salesPerDay: 65,
    viralScore: 80,
    margin: 45,
    commission: 10,
    concurrency: 'Baixa',
    deliveryTime: '4-6 dias',
    supplierRating: 4.7
  },
  {
    id: "chinelo-nuvem-unissex",
    name: "Chinelo Nuvem Unissex Macio Antiderrapante",
    priceText: "R$ 10,90",
    imageUrl: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/9c3796ba1af3436b9b013805c16dd026~tplv-aphluv4xwc-crop-webp:300:291.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1733925089237698174",
    rating: 4.6,
    category: "Moda",
    sales: 25000,
    salesPerDay: 350,
    viralScore: 99,
    margin: 50,
    commission: 15,
    concurrency: 'Alta',
    deliveryTime: '5-9 dias',
    supplierRating: 4.6
  },
  {
    id: "kit-3-cuecas-boxer",
    name: "Kit 3 Cuecas Boxer Algodão Masculina",
    priceText: "R$ 68,60",
    imageUrl: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/20fd8623c7b04eb2ba9348f0b8afa5ff~tplv-o3syd03w52-crop-webp:300:300.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1734135327597299060",
    rating: 4.5,
    category: "Moda",
    sales: 11000,
    salesPerDay: 85,
    viralScore: 84,
    margin: 30,
    commission: 12,
    concurrency: 'Média',
    deliveryTime: '4-6 dias',
    supplierRating: 4.5
  },
  {
    id: "vestido-curto-costa-nua",
    name: "Vestido Curto Costa Nua Duna Leve, Soltinho e Super Elegante!",
    priceText: "R$ 26,34",
    imageUrl: "https://p19-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/ccf42dee8f824e7d8f9da3b812dc801a~tplv-aphluv4xwc-crop-webp:225:300.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1733085955087566347",
    rating: 4.4,
    category: "Moda",
    sales: 5800,
    salesPerDay: 48,
    viralScore: 89,
    margin: 45,
    commission: 20,
    concurrency: 'Média',
    deliveryTime: '6-10 dias',
    supplierRating: 4.4
  },
  {
    id: "escova-secadora-3em1",
    name: "Escova Secadora 110V Alisador Elétrica Quente Cabelo Com 3 Em1",
    priceText: "R$ 45,78",
    imageUrl: "https://p16-oec-va.ibyteimg.com/tos-maliva-i-o3syd03w52-us/0907de2563f44cebacc60eaa04fab2a6~tplv-o3syd03w52-crop-webp:300:300.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1732967190579021721",
    rating: 5.0,
    category: "Beleza",
    sales: 18000,
    salesPerDay: 210,
    viralScore: 97,
    margin: 38,
    commission: 15,
    concurrency: 'Alta',
    deliveryTime: '3-5 dias',
    supplierRating: 5.0
  },
  {
    id: "conjunto-alfaiataria-social",
    name: "Conjunto Alfaiataria Social Femenino Calça e Blusa Regata Elegante Social Fashion",
    priceText: "R$ 71,76",
    imageUrl: "https://p16-oec-sg.ibyteimg.com/tos-alisg-i-aphluv4xwc-sg/f534867091ec4cb1a6eed90ae76e5e21~tplv-aphluv4xwc-crop-webp:225:300.webp?dr=15592&t=555f072d&ps=933b5bde&shp=8dbd94bf&shcp=d741f1be&idc=my2&from=2378011839",
    tiktokUrl: "https://www.tiktok.com/shop/br/pdp/1732741875357549600",
    rating: 4.7,
    category: "Moda",
    sales: 4500,
    salesPerDay: 38,
    viralScore: 81,
    margin: 42,
    commission: 18,
    concurrency: 'Média',
    deliveryTime: '5-7 dias',
    supplierRating: 4.7
  },
];

export const AVATARS = [
  { id: 'ana', name: 'Ana', imageUrl: 'https://i.postimg.cc/htG1jbK3/avatar-ana-DY03RL1T.png' },
  { id: 'bruna', name: 'Bruna', imageUrl: 'https://i.postimg.cc/j2Q4WMwd/avatar-bruna-CChj-CC9j.jpg' },
  { id: 'lucas', name: 'Lucas', imageUrl: 'https://i.postimg.cc/fyjf38tb/avatar-lucas-N0j-b-CGW.png' },
  { id: 'marina', name: 'Marina', imageUrl: 'https://i.postimg.cc/CLgvFqBf/avatar-marina-Bep-Sr-QCX.png' },
  { id: 'rafael', name: 'Rafael', imageUrl: 'https://i.postimg.cc/vZmtBLGJ/avatar-rafael-ZMu-PGJpe.png' },
];
