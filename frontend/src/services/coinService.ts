const calcGainableCoins = async (routeDistance) => {
    const coins = Math.floor(routeDistance / 200);
    console.log('Coins: ', coins);
    return coins;
};

export default calcGainableCoins;