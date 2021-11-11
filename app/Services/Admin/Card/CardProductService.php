<?php

namespace App\Services\Admin\Card;

use App\Models\CardCategory;
use App\Models\CardProduct;
use App\Models\CardSeries;
use App\Models\CardSet;
use Carbon\Carbon;

class CardProductService
{

    public const CARD_RARITIES = [
        'Common',
        'Uncommon',
        'Rare',
    ];

    public const CARD_EDITIONS = [
        '1st Edition',
        'Shadowless',
        'Unlimited',
    ];

    public const CARD_SURFACES = [
        'Holo',
        'Cracked Ice Holo',
        'Cosmos Holo',
        'Reverse Holo',
        'Reverse Foil',
    ];

    public const CARD_LANGUAGES = [
        'Japanese',
        'English',
        'Dutch',
        'German',
        'French',
        'Italian',
        'Spanish',
        'Portuguese',
        '(South) Korean',
        'Traditional Chinese',
        'Russian',
        'Polish',
    ];

    public const CARD_CATEGORY_CODES = [
        'Pokemon' => 'PKM',
    ];

    public const CARD_SERIES_CODES = [
        'Sword & Shield'  => 'SWSH',
        'Sword & Shield Era' => 'SWSH',
        'Sun & Moon' => 'SUMO',
        'Sun & Moon Era' => 'SUMO',
        'XY' => '##XY',
        'XY Era' => '##XY',
        'Black & White' => 'BLWH',
        'Black & White Era' => 'BLWH',
        'Black & White Promos' => 'BWPO',
        'Call of Legends' => 'CLEG',
        'HeartGold SoulSilver' => 'HGSS',
        'Platinum' => 'PLAT',
        'Platinum Era' => 'PLAT',
        'Nintendo Promos' => 'NTDO',
        'Diamond & Pearl' => 'DIPE',
        'Diamond & Pearl Era' => 'DIPE',
        'EX Ruby & Sapphire' => 'EXRS',
        'e-Card' => 'ECRD',
        'Legendary Collection' => 'LEGC',
        'Neo Genesis' => 'NEGE',
        'Gym Heroes' => 'GYMH',
        'Base Set' => 'BASE',
        'Web' => '#WEB',
        'ADV Era' => 'ADVE',
        'PCG Era' => 'PCGE',
        'Legend Era' => 'LEGE',
        'Original Era' => 'ORGE',
        'Neo Era' => 'NEOE',
    ];

    public const CARD_SETS_CODES = [
        'Celebrations' => 'CELB',
        'Evolving Skies' => 'EVSK',
        'Chilling Reign' => 'CHRE',
        'Base Set' => 'BASE',
        'Jungle' => 'JUNG',
        'Wizards of the Coast Promos' => 'WTCP',
        'Fossil' => 'FOSL',
        'Base Set 2' => 'BAS2',
        'Team Rocket' => 'TERO',
        'Gym Heroes' => 'GYMH',
        'Gym Challenge' => 'GYMC',
        'Neo Genesis' => 'NEGE',
        'Neo Discovery' => 'NEDI',
        'Southern Islands' => 'SOIS',
        'Neo Revelation' => 'NERE',
        'Neo Destiny' => 'NEDE',
        'Legendary Collection' => 'LEGC',
        'Expedition' => 'EXPD',
        'Best of Game' => '#BOG',
        'Aquapolis' => 'AQUA',
        'Skyridge' => 'SKYR',
        'EX Ruby & Sapphire' => 'EXRS',
        'EX Sandstorm' => 'EXSS',
        'EX Dragon' => 'EXDR',
        'EX Team Magma vs Team Aqua' => 'TMTA',
        'EX Hidden Legends' => 'EXHL',
        'EX FireRed & LeafGreen' => 'FRLG',
        'EX Team Rocket Returns' => 'EXTR',
        'EX Deoxys' => 'EXDE',
        'EX Emerald' => 'EXEM',
        'EX Unseen Forces' => 'EXUF',
        'EX Unseen Forces Unown Collection' => 'UFUC',
        'EX Delta Species' => 'EXDS',
        'EX Legend Maker' => 'EXLM',
        'EX Holon Phantoms' => 'EXHP',
        'EX Crystal Guardians' => 'EXCG',
        'EX Dragon Frontiers' => 'EXDF',
        'EX Power Keepers' => 'EXPK',
        'Diamond & Pearl' => 'DIPE',
        'DP Black Star Promos' => 'DPPR',
        'Mysterious Treasures' => 'MYTR',
        'Secret Wonders' => 'SEWO',
        'Great Encounters' => 'GREN',
        'Majestic Dawn' => 'MADA',
        'Legends Awakened' => 'LEAW',
        'Stormfront' => 'STFR',
        'Nintendo Promos' => 'NIPR',
        'POP Series 1' => 'POP1',
        'POP Series 2' => 'POP2',
        'POP Series 3' => 'POP3',
        'POP Series 4' => 'POP4',
        'POP Series 5' => 'POP5',
        'POP Series 6' => 'POP6',
        'POP Series 7' => 'POP7',
        'POP Series 8' => 'POP8',
        'POP Series 9' => 'POP9',
        'Platinum' => 'PLAT',
        'Platinum - Rising Rivals' => 'RIRI',
        'Platinum - Supreme Victors' => 'SUVI',
        'Platinum - Arceus' => 'ARCE',
        'Pokemon Rumble' => 'PMRU',
        'HeartGold SoulSilver' => 'HGSS',
        'HeartGold SoulSilver Promos' => 'HSPR',
        'HS Unleashed' => 'HSUL',
        'HS Undaunted' => 'HSUD',
        'HS Triumphant' => 'HSTR',
        'Call of Legends' => 'CLEG',
        'Black & White Promos' => 'BWPR',
        'McDonald\'s Collection (2011)' => 'MC11',
        'McDonald\'s Collection (2012)' => 'MC12',
        'McDonald\'s Collection (2013)' => 'MC13',
        'Black & White' => 'BLWH',
        'Emerging Powers' => 'EMPO',
        'Noble Victories' => 'NOVI',
        'Next Destinies' => 'NDES',
        'Dark Explorers' => 'DAEX',
        'Dragons Exalted' => 'DREX',
        'Dragon Vault' => 'DRVA',
        'Boundaries Crossed' => 'BOCR',
        'Plasma Storm' => 'PLST',
        'Plasma Freeze' => 'PLFR',
        'Plasma Blast' => 'PLBL',
        'Legendary Treasures' => 'LETR',
        'Radiant Collection' => 'RACL',
        'XY' => '##XY',
        'XY Promos' => 'XYPR',
        'Kalos Starter Set' => 'KASS',
        'XY Flashfire' => 'XYFF',
        'McDonald\'s Collection (2014)' => 'MC14',
        'Furious Fists' => 'FUFI',
        'Phantom Forces' => 'PHFO',
        'Primal Clash' => 'PRCL',
        'Double Crisis' => 'DOCR',
        'Roaring Skies' => 'ROSK',
        'Ancient Origins' => 'ANOR',
        'XY BREAKthrough' => 'XYBT',
        'McDonald\'s Collection (2015)' => 'MC15',
        'BREAKPoint' => 'BRPO',
        'Generations' => 'GENR',
        'Fates Collide' => 'FACO',
        'Steam Siege' => 'STSI',
        'McDonald\'s Collection (2016)' => 'MC16',
        'Evolutions' => 'EVOL',
        'Sun & Moon' => 'SUMO',
        'Sun & Moon Promos' => 'SMPR',
        'Guardians Rising' => 'GURI',
        'McDonald\'s Collection (2017)' => 'MC17',
        'Burning Shadows' => 'BUSH',
        'Shining Legends' => 'SHLG',
        'Crimson Invasion' => 'CRIN',
        'Ultra Prism' => 'ULPR',
        'Forbidden Light' => 'FOLI',
        'Celestial Storm' => 'CEST',
        'Dragon Majesty' => 'DRMA',
        'McDonald\'s Collection (2018)' => 'MC18',
        'Lost Thunder' => 'LOTH',
        'Team Up' => 'TEUP',
        'Detective Pikachu' => 'DEPI',
        'Unbroken Bonds' => 'UNBO',
        'Unified Minds' => 'UNMI',
        'Hidden Fates' => 'HIFA',
        'McDonald\'s Collection (2019)' => 'MC19',
        'Cosmic Eclipse' => 'COEC',
        'Sword & Shield' => 'SWSH',
        'Sword & Shield Promos' => 'SSPR',
        'Rebel Clash' => 'RECL',
        'Darkness Ablaze' => 'DAAB',
        'Pokemon Futsal Promos' => 'PFPR',
        'Champion\'s Path' => 'CHPA',
        'Vivid Voltage' => 'VIVO',
        'McDonald\'s 25th Anniversary' => 'MC21',
        'Shining Fates' => 'SHFA',
        'Battle Styles' => 'BAST',
        'Rising Fist' => 'RISF',
        'Tidal Storm' => 'TIDS',
        'Wild Blaze' => 'WLDB',
        'Alolan Moonlight' => 'ALML',
        'Alter Genesis' => 'ALTG',
        'Awakened Heroes' => 'AWKH',
        'Collection Moon' => 'CLCM',
        'Collection Sun' => 'CLCS',
        'Darkness that Consumes Light' => 'DTCL',
        'Double Blaze' => 'DBLB',
        'Islands Await You' => 'ISAY',
        'Miracle Twin' => '##MT',
        'Sky-Splitting Charisma' => 'SSCH',
        'Super-Burst Impact' => 'SBIP',
        'Tag Bolt' => 'TBLT',
        'To Have Seen The Battle Rainbow' => 'THBR',
        'Ultradimensional Beasts' => 'ULDB',
        'Ultra Moon' => 'ULMN',
        'Ultra Sun' => 'ULSN',
        'Amazing Volt Tackle' => 'AMVT',
        'Blue Sky Stream' => '#BSS',
        'Eevee Heroes' => 'EVEH',
        'Fusion Arts' => 'FUSA',
        'Infinity Zone' => 'INFZ',
        'Jet-Black Spirit' => 'JTBS',
        'Rapid Strike Master' => 'RDSM',
        'Rebellion Crash' => 'RBCS',
        'Shiny Star V' => '#SSV',
        'Shield' => 'SHLD',
        'Silver Lance' => 'SLVL',
        'Single Strike Master' => 'SGSM',
        'Skyscraping Perfection' => 'SKSP',
        'Sword' => 'SWRD',
        'Web' => '#WEB',
        'Wind From The Sea' => 'WFTS',
        'The Town On No Map' => 'TONM',
        'Split Earth' => 'SPLE',
        'Mysterious Mountains' => 'MYSM',
        'ADV Expansion Pack' => 'AVEP',
        'Miracle of the Desert' => 'MOTD',
        'Rulers of the Heavens' => 'ROTH',
        'Magma vs Aqua: Two Ambitions' => 'MATA',
        'Undone Seal' => 'UDSL',
        'Flight of Legends' => 'FLOL',
        'Clash of the Blue Sky' => 'CTBS',
        'Rocket Gang Strikes Back' => 'RGSB',
        'Golden Sky, Silvery Ocean' => 'GSSO',
        'Mirage Forest' => 'MIRF',
        'Holon Research Tower' => 'HRTW',
        'Holon Phantom' => 'HLNP',
        'Miracle Crystal' => 'MIRC',
        'Offense and Defense of the Furthest Ends' => 'ODFE',
        'Intense Fight in the Destroyed Sky' => 'IFDS',
        'World Champions Pack' => '#WCP',
        'Advent of Arceus' => '#AOA',
        'Beat of the Frontier' => 'BOTF',
        'Bonds to the End of Time' => 'BTET',
        'Galactic\'s Conquest' => 'GALC',
        'Clash at the Summit' => 'CATS',
        'HeartGold Collection' => 'HGCL',
        'Reviving Legends' => 'REVL',
        'SoulSilver Collection' => 'SSCL',
        'Black Collection' => '#BLC',
        'Cold Flare' => 'CLDF',
        'Dark Rush' => 'DRKR',
        'Dragon Blade' => 'DRBD',
        'Dragon Blast' => 'DRBL',
        'Freeze Bolt' => 'FRBT',
        'Hail Blizzard' => 'HABL',
        'Megalo Cannon' => 'MLCN',
        'Plasma Gale' => 'PLGL',
        'Psycho Drive' => 'PSYD',
        'Red Collection' => 'RDCL',
        'Spiral Force' => 'SPRF',
        'Thunder Knuckle' => 'TNDK',
        'White Collection' => 'WHCL',
        'Awakening Psychic King' => 'APSK',
        'Bandit Ring' => 'BDRN',
        'Blue Shock' => 'BLSH',
        'Collection X' => 'COLX',
        'Collection Y' => 'COLY',
        'Cruel Traitor' => 'CLTR',
        'Emerald Break' => 'EMBR',
        'Expansion Pack 20th Anniversary' => '20AN',
        'Fever-Burst Fighter' => 'FBFT',
        'Gaia Volcano' => 'GVOL',
        'Phantom Gate' => 'PHGT',
        'Rage of the Broken Heavens' => 'RTBH',
        'Red Flash' => 'REDF',
        'Rocket' => 'ROCK',
    ];

    public const CARD_LANGUAGES_CODES = [
        "English" => "ENG",
        "Japanese" => "JPN",
    ];

    public const CARD_EDITIONS_CODES = [
        'Unlimited' => 'UNLM',
        '1st Edition' => '1STE',
        'Shadowless' => 'SHAD',
        '1999-2000' => '2000',
    ];

    public const CARD_SURFACES_CODES = [
        'Holo' => '###H',
        'Reverse Holo' => '##RH',
        'Cosmos Holo' => '##CH',
        'Cracked Ice Holo' => '#CIH',
        'Crosshatch Holo' => '#XHH',
        'Cracked Ice Reverse Holo' => 'CIRH',
        'Sheen Holo' => '##SH',
        'Mirror Holo' => '##MH',
    ];

    public function __construct()
    {
    }

    public function create(array $data): CardProduct
    {
        $category = CardCategory::find($data['category']);

        if(array_key_exists('set_id', $data) && $data['set_id']){
            $set = CardSet::find($data['set_id']);
        }
        else{

            if(array_key_exists('series_id', $data) && $data['series_id']){
                $series = CardSeries::find($data['series_id']);
            }
            else{
                $series = CardSeries::where('name', 'like' , '%' . $data['series_name'] . '%')->where('card_category_id', $category->id)->first();

                if(!$series){
                    $series = new CardSeries([
                        'name' => $data['series_name'],
                        'image_path' => $data['series_image'],
                        'image_bucket_path' => $data['series_image'],
                        'card_category_id' => $category->id,
                    ]);
                    $series->save();
                }
            }

            $set = CardSet::where('name', 'like' , '%' . $data['set_name'] . '%')->where('card_series_id', $series->id)->first();

            if(!$set){
                $set = new CardSet([
                    'name' => $data['set_name'],
                    'description' => '',
                    'image_path' => $data['set_image'],
                    'image_bucket_path' => $data['set_image'],
                    'card_category_id' => $category->id,
                    'card_series_id' => $series->id,
                    'release_date' => $data['release_date'],
                    'release_year' => (new Carbon($data['release_date']))->format('Y'),
                ]);
                $set->save();
            }
        }

        $card = new CardProduct([
            'name' => $data['name'],
            'card_set_id' => $set->id,
            'card_category_id' => $category->id,
            'rarity' => $data['rarity'],
            'card_number' => $data['card_number'],
            'card_number_order' => $data['card_number'],
            'image_path' => $data['image_path'],
            'edition' => $data['edition'] ?? '',
            'surface' => $data['surface'] ?? '',
            'variant' => $data['variant'] ?? '',
            'language' => $data['language'],
            'added_manually' => true,
            'added_by_id' => auth()->user()->id
        ]);
        $card->save();

        return $card;
    }

    public function getOptionsValues()
    {
        return [
            'category' => CardCategory::select('id','name')->get(),
            'rarity' => CardProductService::CARD_RARITIES,
            'edition' => CardProductService::CARD_EDITIONS,
            'surface' => CardProductService::CARD_SURFACES,
            'language' => CardProductService::CARD_LANGUAGES,
            'series' => CardSeries::with('cardSets:id,card_series_id,name,image_path,release_date')
                        ->select('id','name','image_path')->get(),
        ];
    }

    public function generateCardUniqueId(string $category, string $date, string $series, string $set, string $card_number, string $language, string $edition, string $surface): string
    {
        $id = '';

        return $id;
    }
}
