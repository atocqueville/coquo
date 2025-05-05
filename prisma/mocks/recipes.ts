export const aubergineRotie = {
    title: 'Aubergine rôtie, sauce à la purée de sésame et semoule aux amandes',
    picture: 'potimarron.jpg',
    difficulty: 3,
    servings: 4,
    prepTime: 45,
    cookTime: 20,
    description:
        'Une délicieuse tarte aux pommes traditionnelle française, parfaite pour le dessert ou le goûter.',
    ingredients:
        "2x aubergine (560g);Huile d'olive;150 g graines de couscous Bio;25 g amandes effilée;200 mL eau;1x gousse d'ail (4g);30 g purée de sésame Bio;100 g fromage blanc;0.5 citron jaune;qq brins coriandre",
    steps: {
        create: [
            {
                title: `L'aubergine`,
                instructions: `Préchauffez votre four à 220°C en chaleur tournante !;Pendant ce temps, coupez les aubergines en 2 dans le sens de la longueur et quadrillez la chair avec un couteau, sans découper la peau.;Déposez-les sur une plaque allant au four. Versez un bon filet d’huile d'olive. Salez légèrement, poivrez.;Enfournez 35 min jusqu'à ce qu'elles soient cuites.;Pendant ce temps, faites cuire les graines de couscous et préparez la sauce.`,
            },
            {
                title: `Les graines de couscous`,
                instructions: `Faites chauffer une poêle à feu moyen à vif sans matière grasse.;Faites dorer (torréfier) les amandes quelques minutes.;En parallèle, portez à ébullition l'eau et dans un récipient déposez les graines de couscous et les cranberries.;Versez l'eau sur les graines de couscous.;Couvrez et laissez gonfler 5 min.;Ajoutez-y un filet d'huile d'olive. Salez, poivrez et à l'aide d'une fourchette, égrainez-les (séparez les grains).;Ajoutez les amandes effilées et mélangez bien.`,
            },
            {
                title: `La sauce`,
                instructions: `Pressez le citron.;Pressez ou hachez l'ail.;Dans un bol, déposez le citron et l'ail;Ajoutez la purée de sésame et le fromage blanc. Salez, poivrez. Mélangez bien.;Goûtez et rectifiez l'assaisonnement si nécessaire.;Ciselez la coriandre (en entier, les tiges se consomment).;Dégustez sans attendre votre aubergine rôtie accompagnée de la semoule aux amandes ! Nappez le tout de sauce à la purée de sésame et parsemez de coriandre.`,
            },
        ],
    },
    tags: {
        connect: [{ name: 'vegetarian' }, { name: 'quick' }],
    },
};

export const potimarron = {
    title: 'Gnocchis à la crème de potimarron et noisettes',
    picture: 'gnocchis.jpg',
    difficulty: 1,
    servings: 2,
    prepTime: 15,
    cookTime: 35,
    ingredients:
        "800g potimarron;2x gousse d'ail (6g);300g crème;1 bouillon de légumes (cube);2x oignon jaune;2x gousse d'ail (6g);50g noisettes décortiquées;1200g gnocchi de pommes de terre fraiches;Quelques brins de persil plat",
    steps: {
        create: [
            {
                title: `La crème de potimarron`,
                instructions: `Coupez prudemment le potimarron en 2 (il n'est pas nécessaire de l'éplucher, la peau, une fois cuite, devient tendre). Retirez les graines à l'aide d'une cuillère. Coupez-le en tranches puis taillez celles-ci en dés.;Pressez ou hachez l'ail.;Déposez le potimarron dans une casserole avec la moitié de l'ail et le bouillon de légumes. Mouillez à hauteur de la garniture et faites cuire le tout 15 min. Salez.;Une fois cuits, égouttez le potimarron en réservant l'eau de cuisson.;Mixez le potimarron avec la crème jusqu'à obtenir une texture homogène. Ajoutez de l'eau de cuisson petit à petit pour obtenir une sauce liquide.;Suggestion : Ajustez la quantité d'eau selon votre goût.;En parallèle, faites cuire les gnocchis.`,
            },
            {
                title: `Les graines de couscous`,
                instructions: `Émincez l'oignon.;Dans une sauteuse, faites chauffer un filet d'huile d'olive à feu moyen à vif.;Faites revenir l'oignon avec le reste de l'ail 10 min. Salez, poivrez.;Au bout des 10 min, ajoutez les gnocchis et poursuivez la cuisson 5 min.;Effeuillez et ciselez le persil.;Hachez grossièrement les noisettes.`,
            },
        ],
    },
    tags: {
        connect: [{ name: 'winter' }, { name: 'lunch' }, { name: 'vegan' }],
    },
};
