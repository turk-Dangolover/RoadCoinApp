const calcGainableCoins = async (routeDistance) => {
    if(typeof routeDistance !== 'number') {
        routeDistance = parseInt(routeDistance);
    }
    const coins = Math.floor(routeDistance / 200);
    return coins;
};

const calcGainableCoinsNotAsynch = (routeDistance) => {
    if(typeof routeDistance !== 'number') {
        routeDistance = parseInt(routeDistance);
    }
    const coins = Math.floor(routeDistance / 200);
    return coins;
};

export default calcGainableCoins
export { calcGainableCoinsNotAsynch };