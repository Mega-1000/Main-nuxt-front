const shipmentCostBrutto = (items: any) => {
    let finalPrice = 0;
    let GLSks = 0;
    let GLSkd = 0;
    let DPDd = 0;

    console.log(items);
    items.forEach((item: any) => {
        switch(item.delivery_type) {
            case 'GLS':
                GLSks += item.amount / item.assortment_quantity;
                break;
            case 'GLSd':
                GLSkd += item.amount / item.assortment_quantity;
                break;
            case 'DPDd':
                DPDd += item.amount / item.assortment_quantity;
                break;
        }
    });

    return Math.ceil(GLSkd) * 18 + Math.ceil(GLSks) * 18 + Math.ceil(DPDd) * 48;
};


export default shipmentCostBrutto;
