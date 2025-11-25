import fs from 'fs/promises';
import inquirer from 'inquirer';
import chalk from 'chalk';

// --- IMPORTS ---
// Corrected: Removed servicesTable from here
import { tradingPostOrigins, tradingPostSpecialties, tradingPostAges, tradingPostConditions, visitorTrafficTable, tradingPostSizeTable, residentPopulationTable, lawEnforcementTable, leadershipTable, populationWealthTable, crimeTable, shopLocationsData, shopsTable, serviceLocationsData, placeOfWorshipDecisionTable, placeOfWorshipSizeTable, recentHistoryTable, eventsTable, opportunitiesTable, dangerLevelTable, dangerTypeTable } from './tradingpost.js';

// Corrected: Added servicesTable here
import { environmentTable, dispositionTable, oligarchyTypeTable, hiredHelpSizeTable, servicesTable, fervencyTable, officialsTable, officialCompetenceTable } from './commonTables.js';

import { allCityLocations, districtData, additionalLocationRollsCount } from './Districts.js';
import { villageAges, hardshipLikelihoodTable, hardshipTypeTable, hardshipOutcomeTable, villageSizeTable, villageConditionTable, villageSpecialtyTable, villageResourceTable, villageHistoryTable, villagePopulationDensityTable, villageLawEnforcementTable, villageLeadershipTable, villagePopulationWealthTable, villageCrimeTable, placesOfWorshipCountData, villagePlaceOfWorshipSizeTable, gatheringPlacesCountData, gatheringPlacesTable, otherLocationsCountData, otherLocationsTable, villageEventsTable, politicalRumorsTable, villageOpportunitiesTable, villageDangerLevelTable, villageDangerTypeTable } from './villages.js';
import { townOriginsTable, townPriorityTable, townSpecialtyTable, townAgeTable, townSizeTable, townConditionTable, townProsperityTable, marketSquareTable, vendorStallAcquisitionTable, overflowTable, fortificationTable, townPopulationDensityTable, populationOverflowTable, farmsAndResourcesCountData, farmsAndResourcesTable, townVisitorTrafficTable, nightActivityTable, townLeadershipTable, townLawEnforcementTable, townPopulationWealthTable, townCrimeTable, nonCommercialCountData, nonCommercialLocationTypeTable, placesOfEducationTable, townPlacesOfGatheringTable, placesOfGovernmentTable, townPlaceOfWorshipSizeTable, townFervencyTable, alignmentOfTheFaithTable, commercialCountData, shopOrServiceTable, townRecentHistoryTable, marketDayEventsTable } from './town.js';
import { cityRecentHistoryTable, cityOriginsTable, cityPriorityTable, cityAgeTable, citySizeTable, outsideTheCityCountData, outsideTheCityTable, stewardshipTable, generalConditionTable, cityFortificationTable, cityMarketSquareTable, cityVendorStallAcquisitionTable, cityMerchantOverflowTable, undergroundPassagesTable, cityPopulationDensityTable, cityPopulationWealthTable, cityVisitorTrafficTable, cityNightActivityTable, cityLeadershipTable, cityLawEnforcementTable, cityGeneralCrimeTable, cityOrganizedCrimeTable, numberOfDistrictsTable, districtTypeTable, districtConditionTable, districtConditionCrimeModifiers, districtEntryTable, districtCrimeTable, crimeDegreesData, housingTable, districtNotableLocationsTable, beneathTheSurfaceTable, beneathTheSurfaceAwarenessTable } from './city.js';
import { 
    capitalOriginsTable, capitalAgeTable, capitalSizeTable, outsideTheCapitalCountData, outsideTheCapitalTable, 
    capitalStewardshipTable, capitalGeneralConditionTable, capitalFortificationTable, capitalMarketSquareTable, 
    capitalVendorStallAcquisitionTable, capitalMerchantOverflowTable, capitalUndergroundPassagesTable, 
    capitalLeadershipTable, capitalUnityTable, capitalPriorityTable, capitalPriorityApproachTable, 
    capitalPrioritySuccessTable, capitalLifestyleTable, capitalResidenceTable, capitalIntentTable,
    capitalSpyNetworkTable, capitalInfiltrationDepthTable, capitalCounterintelligenceTable, 
    capitalCounterintelligenceWatchfulnessTable, capitalNotableVisitorCountTable, capitalVisitorRoleTable, 
    capitalVisitorReasonTable,
    capitalMilitaryForceTable, capitalMilitaryStandingTable, capitalMilitaryRecruitmentTable,
    capitalMilitarySizeTable, capitalMilitarySpecializationTable, capitalMilitaryFacilitiesTable,
    capitalNobilityTypeTable, capitalNobilityRelationTable, capitalNobleCountTable,
    capitalNobilityPeopleRelationTable, capitalNobilityRootTable,
    capitalPopulationDensityTable, capitalPopulationWealthTable, capitalVisitorTrafficTable, 
    capitalDispositionTable, capitalNightActivityTable, capitalLawEnforcementTable, 
    capitalCrimeTable, capitalOrganizedCrimeTable,
    capitalRecentHistoryTable,
    capitalNumberOfDistrictsTable, capitalDistrictNotableLocationsTable, capitalLocationNotabilityTable
} from './capital.js';

// --- UTILITY FUNCTIONS ---

function rollDice(count, size) {
    if (!size || size < 1) return 0; // Safety check
    let total = 0;
    for (let i = 0; i < count; i++) {
        total += Math.floor(Math.random() * size) + 1;
    }
    return total;
}

function getTableDieSize(table) {
    if (!table || table.length === 0) return 20; // Default fallback
    // If table has min/max
    if (table[0].min !== undefined) {
        return table[table.length - 1].max;
    }
    // If table uses 'dice' keys
    return table.length;
}

function rollOnTable(table, diceSize) {
    const dSize = diceSize || getTableDieSize(table);
    const roll = rollDice(1, dSize);

    if (table[0].min !== undefined) {
        return table.find(item => roll >= item.min && roll <= item.max) || table[0];
    } else {
        return table.find(item => roll === item.dice) || table[0];
    }
}

function applyModifierAndClamp(baseValue, modifier, min, max) {
  let finalValue = baseValue + modifier;
  if (finalValue < min) finalValue = min;
  if (finalValue > max) finalValue = max;
  return finalValue;
}

async function getHiredHelpSize(isAutoRolling) {
    if (isAutoRolling) return rollHiredHelpSize();
    console.log(chalk.bold.cyan(`\nWhat is the size of this hired help group?`));
    const { size } = await inquirer.prompt([{
        type: 'list', name: 'size', message: 'Select Hired Help Size:',
        choices: hiredHelpSizeTable.map(item => ({
            name: `${chalk.white(`[${item.min}-${item.max}]`)} ${chalk.bold(item.name)}`,
            value: item
        })),
        loop: false,
    }]);
    return size;
}

function rollHiredHelpSize() {
    const roll = rollDice(1, 12);
    return hiredHelpSizeTable.find(item => roll >= item.min && roll <= item.max);
}

function formatKeyName(key) {
    return key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').trim();
}

// --- NAME GENERATION ---
const namePrefixes = ['Green', 'Far', 'Clear', 'Red', 'Black', 'White', 'Silver', 'Gold', 'Iron', 'Stone', 'Oak', 'Pine', 'Wolf', 'Eagle', 'Sun', 'Moon', 'Star', 'North', 'South', 'High', 'Low', 'Bright', 'Still', 'Cold'];
const nameSuffixes = ['water', 'view', 'crest', 'hollow', 'dale', 'moor', 'hill', 'pass', 'ridge', 'town', 'burg', 'stead', 'ham', 'wick', 'port', 'watch', 'wood', 'field', 'grove', 'marsh', 'bridge', 'ford', 'brook', 'well'];

function generateSettlementName() {
    const prefix = namePrefixes[Math.floor(Math.random() * namePrefixes.length)];
    let suffix = nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];
    while (prefix.toLowerCase() === suffix.toLowerCase()) {
        suffix = nameSuffixes[Math.floor(Math.random() * nameSuffixes.length)];
    }
    return prefix + suffix;
}

// --- DATA CONFIGURATION ---
const settlementTypes = [
  { name: 'Trading Post', value: 'Trading Post' },
  { name: 'Village', value: 'Village' },
  { name: 'Town', value: 'Town' },
  { name: 'City', value: 'City' },
  { name: 'Capital', value: 'Capital' },
];

const settlementPaths = {
    'Trading Post': [
        { key: 'origin', title: "its origin", prompt: "Select the Trading Post's origin:", table: tradingPostOrigins, type: 'CHOICE' },
        { key: 'specialty', title: "its specialty", prompt: "Select the Trading Post's specialty:", table: tradingPostSpecialties, type: 'CHOICE' },
        { key: 'age', title: "its age", prompt: "Select the Trading Post's age:", table: tradingPostAges, type: 'CHOICE' },
        { key: 'condition', title: "its condition", table: tradingPostConditions, type: 'DERIVED', modifierKey: 'condition' },
        { key: 'visitorTraffic', title: "its visitor traffic", table: visitorTrafficTable, type: 'DERIVED', modifierKey: 'visitorTraffic' },
        { key: 'size', title: "its size", table: tradingPostSizeTable, type: 'DERIVED', modifierKey: 'size' },
        { key: 'break1', type: 'BREAKPOINT', stepName: "Step 1: Core Details" },
        { key: 'residentPopulation', title: "its resident population", table: residentPopulationTable, type: 'DERIVED', modifierKey: 'populationDensity' },
        { key: 'disposition', title: 'the disposition of the locals', table: dispositionTable, type: 'DERIVED', modifierKey: 'disposition' },
        { key: 'lawEnforcement', title: "its law enforcement", table: lawEnforcementTable, type: 'DERIVED', modifierKey: 'lawEnforcement' },
        { key: 'leadership', title: "its leadership", table: leadershipTable, type: 'DERIVED', modifierKey: 'leadership' },
        { key: 'populationWealth', title: 'its population wealth', table: populationWealthTable, type: 'DERIVED', modifierKey: 'populationWealth' },
        { key: 'crime', title: 'its crime level', table: crimeTable, type: 'DERIVED', modifierKey: 'crime' },
        { key: 'break2', type: 'BREAKPOINT', stepName: "Step 2: Community" },
        { key: 'shops', title: 'its shops', type: 'MULTIPLE', countSource: shopLocationsData, table: shopsTable, stepName: "Shops" },
        { key: 'services', title: 'its services', type: 'MULTIPLE', countSource: serviceLocationsData, table: servicesTable, stepName: "Services" },
        { key: 'worshipPlaces', title: 'places of worship', type: 'WORSHIP_PLACES', countSource: placeOfWorshipDecisionTable, table: placeOfWorshipSizeTable, stepName: "Places of Worship" },
        { key: 'break3', type: 'BREAKPOINT', stepName: "Step 3: Points of Interest" },
        { key: 'recentHistory', title: 'its recent history', prompt: 'Select a recent history event:', table: recentHistoryTable, type: 'CHOICE' },
        { key: 'currentEvent', title: 'a current event', prompt: 'Select a current event:', table: eventsTable, type: 'CHOICE' },
        { key: 'opportunity', title: 'an opportunity', prompt: 'Select an available opportunity:', table: opportunitiesTable, type: 'CHOICE' },
        { key: 'dangerLevel', title: 'the local danger level', table: dangerLevelTable, type: 'DERIVED', modifierKey: 'dangerLevel' },
        { key: 'dangerType', title: 'the type of danger', prompt: 'Select the type of danger:', table: dangerTypeTable, type: 'CHOICE', condition: (choices) => choices.dangerLevel?.name !== 'Rare' },
    ],
    'Village': [
        { key: 'age', title: "its age", prompt: "Select the village's age:", table: villageAges, type: 'CHOICE' },
        { key: 'hardships', title: "its past hardships", prompt: "Select the likelihood of past hardships:", table: hardshipLikelihoodTable, type: 'HARDSHIP' },
        { key: 'size', title: "its size", table: villageSizeTable, type: 'DERIVED', modifierKey: 'size' },
        { key: 'condition', title: "its condition", table: villageConditionTable, type: 'DERIVED', modifierKey: 'condition' },
        { key: 'specialty', title: "its specialty", prompt: "Select the village's specialty:", table: villageSpecialtyTable, type: 'CHOICE' },
        { key: 'resource', title: "its primary resource", prompt: "Select the village's primary resource:", table: villageResourceTable, type: 'CHOICE' },
        { key: 'environment', title: "its surrounding environment", prompt: "Select an environment:", table: environmentTable, type: 'CHOICE', condition: (choices) => !choices.environment },
        { key: 'history', title: "its recent history", prompt: "Select a recent historical event:", table: villageHistoryTable, type: 'CHOICE' },
        { key: 'break1', type: 'BREAKPOINT', stepName: "Step 1: Core Details" },
        { key: 'populationDensity', title: "its population density", table: villagePopulationDensityTable, type: 'DERIVED', modifierKey: 'populationDensity' },
        { key: 'disposition', title: 'the disposition of the locals', table: dispositionTable, type: 'DERIVED', modifierKey: 'disposition' },
        { key: 'lawEnforcement', title: "its law enforcement", table: villageLawEnforcementTable, type: 'DERIVED', modifierKey: 'lawEnforcement' },
        { key: 'leadership', title: "its leadership", prompt: "Select the village's leadership:", table: villageLeadershipTable, type: 'CHOICE' },
        { key: 'populationWealth', title: 'its population wealth', table: villagePopulationWealthTable, type: 'DERIVED', modifierKey: 'populationWealth' },
        { key: 'crime', title: 'its crime level', table: villageCrimeTable, type: 'DERIVED', modifierKey: 'crime' },
        { key: 'break2', type: 'BREAKPOINT', stepName: "Step 2: Community" },
        { key: 'worshipPlaces', title: 'its places of worship', type: 'WORSHIP_PLACES', countSource: placesOfWorshipCountData, table: villagePlaceOfWorshipSizeTable },
        { key: 'gatheringPlaces', title: 'its gathering places', type: 'GATHERING_PLACES', countSource: gatheringPlacesCountData },
        { key: 'villageLocations', title: 'other locations', type: 'VILLAGE_LOCATIONS', countSource: otherLocationsCountData },
        { key: 'break3', type: 'BREAKPOINT', stepName: "Step 3: Points of Interest" },
        { key: 'currentEvent', title: 'a current event', prompt: 'Select a current event:', table: villageEventsTable, type: 'CHOICE' },
        { key: 'politicalRumor', title: 'a political rumor', prompt: 'Select a political rumor:', table: politicalRumorsTable, type: 'CHOICE' },
        { key: 'opportunity', title: 'an opportunity', prompt: 'Select an available opportunity:', table: villageOpportunitiesTable, type: 'CHOICE' },
        { key: 'dangerLevel', title: 'the local danger level', table: villageDangerLevelTable, type: 'DERIVED', modifierKey: 'dangerLevel' },
        { key: 'dangerType', title: 'the type of danger', prompt: 'Select the type of danger:', table: villageDangerTypeTable, type: 'CHOICE', condition: (choices) => choices.dangerLevel?.name !== 'No Danger or Hazards' },
    ],
    'Town': [
        { key: 'origin', title: "its origin", prompt: "Select the town's origin:", table: townOriginsTable, type: 'CHOICE' },
        { key: 'priority', title: "its priority", prompt: "Select the town's priority:", table: townPriorityTable, type: 'CHOICE' },
        { key: 'specialty', title: "its specialty", prompt: "Select the town's specialty:", table: townSpecialtyTable, type: 'CHOICE' },
        { key: 'age', title: "its age", prompt: "Select the town's age:", table: townAgeTable, type: 'CHOICE' },
        { key: 'size', title: "its size", table: townSizeTable, type: 'DERIVED', modifierKey: 'size' },
        { key: 'condition', title: "its condition", table: townConditionTable, type: 'DERIVED', modifierKey: 'condition' },
        { key: 'environment', title: "its surrounding environment", prompt: "Select an environment:", table: environmentTable, type: 'CHOICE', condition: (choices) => !choices.environment },
        { key: 'prosperity', title: "its prosperity", table: townProsperityTable, type: 'DERIVED', modifierKey: 'prosperity' },
        { key: 'marketSquare', title: 'its market square', table: marketSquareTable, type: 'DERIVED', modifierKey: 'marketSquare' },
        { key: 'vendorStallAcquisition', title: 'how vendor stalls are acquired', prompt: 'Select the vendor stall acquisition method:', table: vendorStallAcquisitionTable, type: 'CHOICE' },
        { key: 'overflow', title: 'how excess vendors are handled', prompt: 'Select the merchant overflow rule:', table: overflowTable, type: 'CHOICE' },
        { key: 'fortification', title: 'its fortifications', table: fortificationTable, type: 'DERIVED', modifierKey: 'fortification' },
        { key: 'break1', type: 'BREAKPOINT', stepName: "Step 1: Core Details" },
        { key: 'populationDensity', title: 'its population density', table: townPopulationDensityTable, type: 'DERIVED', modifierKey: 'populationDensity' },
        { key: 'populationOverflow', title: 'its population overflow', table: populationOverflowTable, type: 'DERIVED', modifierKey: 'populationOverflow' },
        { key: 'farmsAndResources', title: 'its farms and resources', type: 'FARMS_AND_RESOURCES', countSource: farmsAndResourcesCountData },
        { key: 'visitorTraffic', title: 'its visitor traffic', table: townVisitorTrafficTable, type: 'DERIVED', modifierKey: 'visitorTraffic' },
        { key: 'nightActivity', title: 'its night activity', table: nightActivityTable, type: 'DERIVED', modifierKey: 'nightActivity' },
        { key: 'disposition', title: 'the disposition of the locals', table: dispositionTable, type: 'DERIVED', modifierKey: 'disposition' },
        { key: 'leadership', title: 'its leadership', prompt: "Select the town's leadership:", table: townLeadershipTable, type: 'CHOICE' },
        { key: 'lawEnforcement', title: 'its law enforcement', table: townLawEnforcementTable, type: 'DERIVED', modifierKey: 'lawEnforcement' },
        { key: 'populationWealth', title: 'its population wealth', table: townPopulationWealthTable, type: 'DERIVED', modifierKey: 'populationWealth' },
        { key: 'crime', title: 'its crime level', table: townCrimeTable, type: 'DERIVED', modifierKey: 'crime' },
        { key: 'break2', type: 'BREAKPOINT', stepName: "Step 2: Community" },
        { key: 'nonCommercialTypes', title: 'its non-commercial location types', type: 'NON_COMMERCIAL_LOCATIONS', countSource: nonCommercialCountData },
        { key: 'nonCommercialLocations', title: 'its specific non-commercial locations', type: 'FLESH_OUT_NON_COMMERCIAL' },
        { key: 'commercialLocations', title: 'its commercial locations', type: 'COMMERCIAL_LOCATIONS', countSource: commercialCountData },
        { key: 'break3', type: 'BREAKPOINT', stepName: "Step 3: Points of Interest" },
        { key: 'recentHistory', title: 'its recent history', prompt: 'Select a recent history event:', table: townRecentHistoryTable, type: 'CHOICE' },
        { key: 'noteworthyOfficial', title: 'a noteworthy official', type: 'NOTEWORTHY_OFFICIAL', table: officialsTable, subTable: officialCompetenceTable },
        { key: 'marketDayEvent', title: 'a market day event', prompt: 'Select a market day event:', table: marketDayEventsTable, type: 'CHOICE' },
    ],
    'City': [
        { key: 'origin', title: "its origin", prompt: "Select the city's origin:", table: cityOriginsTable, type: 'CHOICE' },
        { key: 'priority', title: "its priority", prompt: "Select the city's priority:", table: cityPriorityTable, type: 'CHOICE' },
        { key: 'age', title: "its age", prompt: "Select the city's age:", table: cityAgeTable, type: 'CHOICE' },
        { key: 'size', title: "its size", prompt: "Select the city's size:", table: citySizeTable, type: 'CHOICE' },
        { key: 'outsideTheCity', title: 'features outside the city', type: 'OUTSIDE_THE_CITY', countSource: outsideTheCityCountData, table: outsideTheCityTable },
        { key: 'stewardship', title: "its stewardship", prompt: "Select the city's stewardship:", table: stewardshipTable, type: 'CHOICE' },
        { key: 'generalCondition', title: "its general condition", table: generalConditionTable, type: 'DERIVED', modifierKey: 'condition' },
        { key: 'environment', title: "its surrounding environment", prompt: "Select an environment:", table: environmentTable, type: 'CHOICE', condition: (choices) => !choices.environment },
        { key: 'fortification', title: 'its fortifications', table: cityFortificationTable, type: 'DERIVED', modifierKey: 'fortification' },
        { key: 'marketSquare', title: 'its market square', table: cityMarketSquareTable, type: 'DERIVED', modifierKey: 'marketSquare' },
        { key: 'vendorStallAcquisition', title: 'how vendor stalls are acquired', prompt: 'Select the vendor stall acquisition method:', table: cityVendorStallAcquisitionTable, type: 'CHOICE' },
        { key: 'merchantOverflow', title: 'how excess vendors are handled', prompt: 'Select the merchant overflow rule:', table: cityMerchantOverflowTable, type: 'CHOICE' },
        { key: 'undergroundPassages', title: 'its underground passages', prompt: 'Select the nature of its underground passages:', table: undergroundPassagesTable, type: 'CHOICE' },
        { key: 'break1', type: 'BREAKPOINT', stepName: "Step 1: Core Details" },
        { key: 'populationDensity', title: 'its population density', table: cityPopulationDensityTable, type: 'DERIVED', modifierKey: 'populationDensity' },
        { key: 'populationWealth', title: 'its population wealth', table: cityPopulationWealthTable, type: 'DERIVED', modifierKey: 'populationWealth' },
        { key: 'visitorTraffic', title: 'its visitor traffic', table: cityVisitorTrafficTable, type: 'DERIVED', modifierKey: 'visitorTraffic' },
        { key: 'disposition', title: 'the disposition of the locals', table: dispositionTable, type: 'DERIVED', modifierKey: 'disposition' },
        { key: 'nightActivity', title: 'its night activity', table: cityNightActivityTable, type: 'DERIVED', modifierKey: 'nightActivity' },
        { key: 'leadership', title: 'its leadership', prompt: "Select the city's leadership:", table: cityLeadershipTable, type: 'CHOICE' },
        { key: 'lawEnforcement', title: 'its law enforcement', table: cityLawEnforcementTable, type: 'DERIVED', modifierKey: 'lawEnforcement' },
        { key: 'generalCrime', title: 'its general crime level', table: cityGeneralCrimeTable, type: 'DERIVED', modifierKey: 'crime' },
        { key: 'organizedCrime', title: 'its organized crime presence', prompt: 'Select the nature of organized crime:', table: cityOrganizedCrimeTable, type: 'CHOICE', condition: (choices) => choices.leadership?.rules?.crime?.forceOrganizedCrime || choices.generalCrime?.rules?.crime?.hasOrganizedCrime },
        { key: 'break2', type: 'BREAKPOINT', stepName: "Step 2: Community" },
        { key: 'districts', title: 'its districts and their locations', type: 'DISTRICTS' },
        { key: 'break3', type: 'BREAKPOINT', stepName: "Step 3: Districts & Locations" },
        { key: 'locationQuality', title: 'the quality of its locations', type: 'GENERATE_LOCATION_QUALITY' },
        { key: 'break4', type: 'BREAKPOINT', stepName: "Step 4: Intrigue & Events" },
        { key: 'recentHistory', title: 'its recent history', prompt: 'Select a recent history event:', table: cityRecentHistoryTable, type: 'CHOICE' },
        { key: 'noteworthyOfficial', title: 'a noteworthy official', type: 'NOTEWORTHY_OFFICIAL', table: officialsTable, subTable: officialCompetenceTable },
        { key: 'beneathTheSurface', title: 'something beneath the surface', type: 'BENEATH_THE_SURFACE', table: beneathTheSurfaceTable, subTable: beneathTheSurfaceAwarenessTable },
    ],
    'Capital': [
        { key: 'origin', title: "its origin", prompt: "Select the capital's origin:", table: capitalOriginsTable, type: 'CHOICE' },
        { key: 'age', title: "its age", prompt: "Select the capital's age:", table: capitalAgeTable, type: 'CHOICE' },
        { key: 'size', title: "its size", prompt: "Select the capital's size:", table: capitalSizeTable, type: 'CHOICE' },
        { key: 'environment', title: "its surrounding environment", prompt: "Select an environment:", table: environmentTable, type: 'CHOICE' },
        { key: 'outsideTheCapital', title: 'features outside the capital', type: 'SUB_ROLL_MULTIPLE', countSource: outsideTheCapitalCountData, table: outsideTheCapitalTable },
        { key: 'stewardship', title: "its stewardship", prompt: "Select the capital's stewardship:", table: capitalStewardshipTable, type: 'CHOICE' },
        { key: 'generalCondition', title: "its general condition", table: capitalGeneralConditionTable, type: 'DERIVED', modifierKey: 'condition' },
        { key: 'fortification', title: 'its fortifications', table: capitalFortificationTable, type: 'DERIVED', modifierKey: 'fortification' },
        { key: 'marketSquare', title: 'its market square', table: capitalMarketSquareTable, type: 'DERIVED', modifierKey: 'marketSquare' },
        { key: 'vendorStallAcquisition', title: 'how vendor stalls are acquired', prompt: 'Select the vendor stall acquisition method:', table: capitalVendorStallAcquisitionTable, type: 'CHOICE' },
        { key: 'merchantOverflow', title: 'how excess vendors are handled', prompt: 'Select the merchant overflow rule:', table: capitalMerchantOverflowTable, type: 'CHOICE' },
        { key: 'undergroundPassages', title: 'its underground passages', prompt: 'Select the nature of its underground passages:', table: capitalUndergroundPassagesTable, type: 'CHOICE' },
        { key: 'break1', type: 'BREAKPOINT', stepName: "Step 1: Core Details" },
        { key: 'leadership', title: "its leadership", prompt: "Select the capital's leadership:", table: capitalLeadershipTable, type: 'CHOICE' },
        { key: 'leadershipUnity', title: "the unity of the leadership", prompt: "Select the leadership's unity:", table: capitalUnityTable, type: 'CHOICE' },
        { key: 'governingPriority', title: "its governing priority", prompt: "Select the governing priority:", table: capitalPriorityTable, type: 'CHOICE' },
        { key: 'priorityApproach', title: "its priority approach", prompt: "Select the priority approach:", table: capitalPriorityApproachTable, type: 'CHOICE' },
        { key: 'prioritySuccess', title: "its priority success", prompt: "Select the priority success:", table: capitalPrioritySuccessTable, type: 'CHOICE' },
        { key: 'numberOfLeaders', title: "the number of leaders", type: 'NUMBER_OF_LEADERS' },
        { key: 'leaderDetails', title: "details for each leader", type: 'LEADER_DETAILS' },
        { key: 'break2', type: 'BREAKPOINT', stepName: "Step 2: Government & Society" },
        { key: 'spyNetwork', title: "its spy network size", prompt: "Select the spy network size:", table: capitalSpyNetworkTable, type: 'CHOICE' },
        { key: 'infiltrationDepth', title: "its infiltration depth", prompt: "Select the infiltration depth:", table: capitalInfiltrationDepthTable, type: 'CHOICE', condition: (choices) => choices.spyNetwork?.name !== 'None' },
        { key: 'counterintelligence', title: "its counterintelligence", prompt: "Select the counterintelligence level:", table: capitalCounterintelligenceTable, type: 'CHOICE' },
        { key: 'counterintelligenceWatchfulness', title: "its counterintelligence watchfulness", prompt: "Select the counterintelligence watchfulness:", table: capitalCounterintelligenceWatchfulnessTable, type: 'CHOICE', condition: (choices) => choices.counterintelligence?.name !== 'None' },
        { key: 'notableVisitors', title: "its notable visitors", type: 'NOTABLE_VISITORS', countTable: capitalNotableVisitorCountTable, roleTable: capitalVisitorRoleTable, reasonTable: capitalVisitorReasonTable },
        { key: 'break3', type: 'BREAKPOINT', stepName: "Step 3: Military" },
        { key: 'militaryForce', title: "military presence", table: capitalMilitaryForceTable, type: 'DERIVED', modifierKey: 'militaryForce' },
        { key: 'militaryStanding', title: "military standing", table: capitalMilitaryStandingTable, type: 'CHOICE', condition: (choices) => choices.militaryForce?.hasMilitary },
        { key: 'militaryRecruitment', title: "military recruitment", prompt: "Select the recruitment type:", table: capitalMilitaryRecruitmentTable, type: 'CHOICE', condition: (choices) => choices.militaryForce?.hasMilitary },
        { key: 'militarySize', title: "size of the force", table: capitalMilitarySizeTable, type: 'DERIVED', modifierKey: 'militaryForce', condition: (choices) => choices.militaryForce?.hasMilitary },
        { key: 'militarySpecialization', title: "military specialization", prompt: "Select the military specialization:", table: capitalMilitarySpecializationTable, type: 'CHOICE', condition: (choices) => choices.militaryForce?.hasMilitary },
        { key: 'militaryFacilities', title: "military facilities", prompt: "Select the military facilities:", table: capitalMilitaryFacilitiesTable, type: 'CHOICE', condition: (choices) => choices.militaryForce?.hasMilitary },
        { key: 'break4', type: 'BREAKPOINT', stepName: "Step 4: Nobility" },
        { key: 'nobilityType', title: "type of nobility", prompt: "Select the type of nobility:", table: capitalNobilityTypeTable, type: 'CHOICE' },
        { key: 'nobilityRelation', title: "nobility's relationship to leadership", table: capitalNobilityRelationTable, type: 'DERIVED', modifierKey: 'nobilityRelation' },
        { key: 'nobilityPeopleRelation', title: "nobility's relationship with the people", type: 'NOBILITY_RELATION_PEOPLE' },
        { key: 'nobilityCounts', title: "nobility counts", type: 'NOBILITY_COUNTS', table: capitalNobleCountTable },
        { key: 'break5', type: 'BREAKPOINT', stepName: "Step 5: Community" },
        { key: 'populationDensity', title: "its population density", table: capitalPopulationDensityTable, type: 'DERIVED', modifierKey: 'populationDensity' },
        { key: 'populationWealth', title: 'its population wealth', table: capitalPopulationWealthTable, type: 'DERIVED', modifierKey: 'populationWealth' },
        { key: 'visitorTraffic', title: "its visitor traffic", table: capitalVisitorTrafficTable, type: 'DERIVED', modifierKey: 'visitorTraffic' },
        { key: 'disposition', title: 'the disposition of the locals', table: capitalDispositionTable, type: 'DERIVED', modifierKey: 'disposition' },
        { key: 'nightActivity', title: 'its night activity', table: capitalNightActivityTable, type: 'DERIVED', modifierKey: 'nightActivity' },
        { key: 'lawEnforcement', title: 'its law enforcement', table: capitalLawEnforcementTable, type: 'DERIVED', modifierKey: 'lawEnforcement' },
        { key: 'crime', title: 'its crime level', table: capitalCrimeTable, type: 'DERIVED', modifierKey: 'crime' },
        { key: 'organizedCrime', title: 'its organized crime presence', prompt: 'Select the nature of organized crime:', table: capitalOrganizedCrimeTable, type: 'CHOICE', condition: (choices) => choices.leadership?.rules?.crime?.forceOrganizedCrime || choices.crime?.rules?.hasOrganizedCrime },
        { key: 'break6', type: 'BREAKPOINT', stepName: "Step 6: Districts & Locations" },
        { key: 'districts', title: 'its districts and their locations', type: 'DISTRICTS', tables: { number: capitalNumberOfDistrictsTable, notable: capitalDistrictNotableLocationsTable, notability: capitalLocationNotabilityTable } },
        { key: 'locationQuality', title: 'the quality of its locations', type: 'GENERATE_LOCATION_QUALITY' },
        { key: 'break7', type: 'BREAKPOINT', stepName: "Step 7: Extra Intrigue" },
        { key: 'recentHistory', title: 'its recent history', prompt: 'Select a recent history event:', table: capitalRecentHistoryTable, type: 'CHOICE' },
        { key: 'noteworthyOfficial', title: 'a noteworthy official', type: 'NOTEWORTHY_OFFICIAL', table: officialsTable, subTable: officialCompetenceTable },
        { key: 'beneathTheSurface', title: 'something beneath the surface', type: 'BENEATH_THE_SURFACE', table: beneathTheSurfaceTable, subTable: beneathTheSurfaceAwarenessTable },
    ],
};
// --- STEP PROCESSORS ---
const stepProcessors = {
    CHOICE: async (step, { choices, isAutoRolling, freeLocations }) => {
        const rules = choices.priority?.rules?.[step.key];
        const diceSize = rules?.diceOverride;

        let choice;
        let retries = 0;
        do {
            choice = isAutoRolling
                ? rollOnTable(step.table, diceSize)
                : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: step.prompt,
                    choices: step.table.map(item => {
                        const isDisabled = (diceSize && item.dice > diceSize) || (rules?.rerollRange && (item.min >= rules.rerollRange[0] && item.min <= rules.rerollRange[1]));
                        return {
                            name: `${chalk.white(`[${item.dice || `${item.min}-${item.max}`}]`)} ${chalk.bold(item.name)}: ${item.description || ''}`,
                            value: item,
                            disabled: isDisabled ? 'Disabled by Priority rule' : false
                        };
                    }),
                    loop: false, pageSize: 15,
                }])).choice;
            
            if (!choice) {
                if (isAutoRolling) continue; 
            }

            if (step.key === 'recentHistory' && choice.name === 'Reroll') {
                if (isAutoRolling) {
                    console.log(chalk.yellow(`      -> Rolled "Reroll". Rerolling recent history...`));
                    retries++;
                    if(retries > 10) break;
                    continue;
                } else {
                    console.log(chalk.yellow(`      -> Please select another event.`));
                    continue;
                }
            }
            break; 
        } while (true);
        
        console.log(`  ${chalk.magenta('Result:')} ${chalk.white(choice.name)}`);
        
        if (choice && choice.rules?.farmsAndResources && !isAutoRolling) {
             console.log(chalk.yellow(`      -> NOTE: This specialty requires a reroll on the Farms & Resources table if the result is 1-8.`));
        }

        if (choice.name === 'Port') {
            const roll = rollDice(1, 6);
            const envName = (roll <= 3) ? 'Coastal' : 'River';
            const environmentChoice = environmentTable.find(e => e.name === envName);
            if (environmentChoice) {
                choices.environment = environmentChoice;
                console.log(chalk.yellow(`      -> Port origin automatically sets the environment to: ${chalk.white(envName)}`));
            }
        }

        if (choice.subTable === 'oligarchy') {
            console.log(chalk.cyan(`    -> An Oligarchy has been established. Determining type...`));
            const subChoice = isAutoRolling ? rollOnTable(oligarchyTypeTable) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: 'Select the type of Oligarchy:',
                choices: oligarchyTypeTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}`, value: item })),
                loop: false
            }])).choice;
            choice.subChoice = subChoice;
            console.log(`      ${chalk.magenta('Oligarchy Type:')} ${chalk.white(subChoice.name)}`);
            if (subChoice.name === 'Priests (Theocracy)') {
                 freeLocations.push({ category: 'Non-Commercial', name: 'Place of Worship' });
                 console.log(chalk.yellow(`      -> Gained a free location: ${chalk.white('Place of Worship')}`));
            }
        }

        if (choice.freeLocation) {
            if (choice.freeLocation.subTable) {
                const subRoll = rollOnTable(choice.freeLocation.subTable);
                freeLocations.push({ category: choice.freeLocation.category, name: subRoll.name });
                 console.log(chalk.yellow(`      -> Gained a free location: ${chalk.white(subRoll.name)}`));
            } else {
                freeLocations.push(choice.freeLocation);
                console.log(chalk.yellow(`      -> Gained a free location: ${chalk.white(choice.freeLocation.name)}`));
            }
        }

        return { key: step.key, value: choice };
    },

    HIRED_HELP_SIZE_CHOICE: async (step, { isAutoRolling }) => {
        const choice = await getHiredHelpSize(isAutoRolling);
        console.log(`  ${chalk.magenta('Result:')} ${chalk.white(choice.name)}`);
        return { key: step.key, value: choice };
    },

    DERIVED: async (step, { choices, modifiers, isAutoRolling }) => {
        const modifier = (modifiers[step.modifierKey] || 0) + (modifiers[`${step.modifierKey}Penalty`] || 0);
        
        if (isAutoRolling) {
            let baseRoll;
            let finalScore;
            const rules = choices.priority?.rules?.[step.key];
            const maxDie = getTableDieSize(step.table);
            
            do {
                baseRoll = rollDice(1, maxDie);
                finalScore = applyModifierAndClamp(baseRoll, modifier, 1, maxDie);
            } while (rules?.rerollRange && (finalScore >= rules.rerollRange[0] && finalScore <= rules.rerollRange[1]));
            
            const result = (step.table[0].min !== undefined)
                ? step.table.find(item => finalScore >= item.min && finalScore <= item.max)
                : step.table.find(item => finalScore === item.dice);

            if (result) {
                console.log(`  ${chalk.magenta('Result:')} ${chalk.white(result.name)}`);
                console.log(`  ${chalk.gray(`(Rolled ${baseRoll}, Modifier ${modifier >= 0 ? '+' : ''}${modifier}, Final ${finalScore})`)}`);
                const rollDetail = { base: baseRoll, modifier, final: finalScore };
                return { key: step.key, value: result, rollDetail };
            }
        } else {
            console.log(chalk.gray(`  (Current modifier for this roll is ${modifier >= 0 ? '+' : ''}${modifier})`));
            const rules = choices.priority?.rules?.[step.key];
            if (rules?.rerollRange) {
                console.log(chalk.yellow(`      -> The town's Priority requires rerolling results from ${rules.rerollRange[0]}-${rules.rerollRange[1]} on this table.`));
            }
            const answer = await inquirer.prompt([{
                type: 'list', name: 'choice', message: `Select ${step.title}:`,
                choices: step.table.map(item => ({
                    name: `[${item.dice || `${item.min}-${item.max}`}] ${chalk.bold(item.name)}: ${item.description}`,
                    value: item,
                })),
                loop: false,
            }]);
            const choice = answer.choice;
            console.log(`  ${chalk.magenta('Result:')} ${chalk.white(choice.name)}`);
            return { key: step.key, value: choice };
        }
        return null;
    },

    HARDSHIP: async (step, { modifiers, isAutoRolling }) => {
        let likelihood;
        if (isAutoRolling) {
            const baseRoll = rollDice(1, 20);
            const modifier = modifiers.hardshipLikelihood || 0;
            const finalScore = applyModifierAndClamp(baseRoll, modifier, 1, 20);
            likelihood = hardshipLikelihoodTable.find(item => finalScore >= item.min && finalScore <= item.max);
            console.log(`  ${chalk.magenta('Likelihood:')} ${chalk.white(likelihood.name)}`);
            console.log(`  ${chalk.gray(`(Rolled ${baseRoll}, Modifier ${modifier >= 0 ? '+' : ''}${modifier}, Final ${finalScore})`)}`);
        } else {
            const modifier = modifiers.hardshipLikelihood || 0;
            console.log(chalk.gray(`  (Current modifier for this roll is ${modifier >= 0 ? '+' : ''}${modifier})`));
            const answer = await inquirer.prompt([{
                type: 'list', name: 'choice', message: step.prompt,
                choices: hardshipLikelihoodTable.map(item => ({
                    name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`,
                    value: item,
                })),
                loop: false,
            }]);
            likelihood = answer.choice;
            console.log(`  ${chalk.magenta('Likelihood:')} ${chalk.white(likelihood.name)}`);
        }
        
        if (likelihood.count === 0) {
            return { key: step.key, value: [{ type: likelihood, outcomes: [] }] };
        }

        const hardships = [];
        for (let i = 0; i < likelihood.count; i++) {
            console.log(chalk.cyan(`\n    -> Determining Hardship #${i + 1}...`));
            
            let hardshipType;
            if (isAutoRolling) {
                hardshipType = rollOnTable(hardshipTypeTable);
            } else {
                const answer = await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the type for Hardship #${i + 1}:`,
                    choices: hardshipTypeTable.map(item => ({
                        name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`,
                        value: item,
                    })),
                    loop: false,
                }]);
                hardshipType = answer.choice;
            }
            console.log(`      ${chalk.magenta('Type:')} ${chalk.white(hardshipType.name)}`);

            const outcomes = [];
            for (const attribute of hardshipType.modifiedAttributes) {
                let outcome;
                if (isAutoRolling) {
                    outcome = rollOnTable(hardshipOutcomeTable);
                } else {
                     const answer = await inquirer.prompt([{
                        type: 'list', name: 'choice', message: `Select the outcome for the '${formatKeyName(attribute)}' attribute:`,
                        choices: hardshipOutcomeTable.map(item => ({
                            name: `[${item.min}-${item.max}] ${chalk.bold(item.name)} (${item.modifier}): ${item.description}`,
                            value: item,
                        })),
                        loop: false,
                    }]);
                    outcome = answer.choice;
                }
                
                outcomes.push({ attribute, outcome });
                const penaltyKey = `${attribute}Penalty`;
                modifiers[penaltyKey] = (modifiers[penaltyKey] || 0) + outcome.modifier;
                
                console.log(`        ${chalk.gray(`- Outcome for ${formatKeyName(attribute)}:`)} ${chalk.white(outcome.name)} (${chalk.red(outcome.modifier)})`);
            }
            hardships.push({ type: hardshipType, outcomes });
        }
        
        return { key: step.key, value: hardships };
    },

    MULTIPLE: async (step, { choices, isAutoRolling }) => {
        let numberOfItems = 0;
        if (choices.size && step.countSource[choices.size.name]) {
            const calcData = step.countSource[choices.size.name];
            numberOfItems = rollDice(calcData.dieCount, calcData.dieSize) + calcData.bonus;
        }

        console.log(chalk.bold.cyan(`\nThis settlement has ${numberOfItems} ${step.stepName.toLowerCase()}.`));
        const choiceMethod = isAutoRolling ? 'Auto-Roll' : (await inquirer.prompt([{
            type: 'list', name: 'choiceMethod', message: 'How would you like to determine them?',
            choices: ['Auto-Roll', 'Manual Selection'], loop: false,
        }])).choiceMethod;

        let chosenItems = [];
        if (choiceMethod === 'Auto-Roll') {
            if (!isAutoRolling) console.log(chalk.gray('Auto-rolling the selection...'));
            for (let i = 0; i < numberOfItems; i++) {
                const roll = rollDice(1, 100);
                const item = step.table.find(s => roll >= s.min && roll <= s.max);
                if (item) chosenItems.push({ item, size: item.name.includes('Hired Help') ? rollHiredHelpSize() : null });
            }
            if (chosenItems.length === 0) console.log(chalk.gray('  -> None were generated.'));
            else chosenItems.forEach(entry => console.log(`${chalk.green('  -')} ${chalk.white(entry.item.name)}${entry.size ? chalk.gray(` (Size: ${entry.size.name})`) : ''}`));
        } else { // Manual Selection
            while (chosenItems.length < numberOfItems) {
                console.clear();
                console.log(chalk.bold.yellow(`\n--- Manual ${step.stepName} Selection ---`));
                console.log(chalk.white(`You can select up to ${numberOfItems}. (${chosenItems.length} selected so far)`));
                if (chosenItems.length > 0) console.log(chalk.gray('Current Items: ' + chosenItems.map(e => e.item.name).join(', ')));

                const { manualItemChoice } = await inquirer.prompt([{
                    type: 'list', name: 'manualItemChoice', message: 'Select an item to add:',
                    choices: [
                        { name: chalk.bold.red('--- I\'m done selecting ---'), value: 'done' },
                        new inquirer.Separator(),
                        ...step.table.map(item => ({
                            name: `[${String(item.min).padStart(2, '0')}-${String(item.max).padStart(2, '0')}] ${chalk.bold(item.name)}`,
                            value: item
                        }))
                    ],
                    loop: false, pageSize: 15
                }]);
                if (manualItemChoice === 'done') break;
                chosenItems.push({ item: manualItemChoice, size: manualItemChoice.name.includes('Hired Help') ? await getHiredHelpSize(false) : null });
            }
        }
        return { key: step.key, value: chosenItems };
    },

    BREAKPOINT: async (step, { modeState }) => {
        if (modeState.current === 'autoRollAll') {
            console.log(chalk.gray(`--- Reached ${step.stepName}, continuing automatically. ---`));
            return null;
        }
        if (modeState.current === 'autoRollSection') modeState.current = 'manual';

        console.log(chalk.bold.green(`\n--- End of ${step.stepName} ---`));
        const { breakChoice } = await inquirer.prompt([{
            type: 'list', name: 'breakChoice', message: 'What would you like to do?',
            choices: ['Continue', 'Auto-Roll: Section', 'Auto-Roll: Finish', 'Done'],
            loop: false,
        }]);

        if (breakChoice === 'Auto-Roll: Section') modeState.current = 'autoRollSection';
        else if (breakChoice === 'Auto-Roll: Finish') modeState.current = 'autoRollAll';
        else if (breakChoice === 'Done') modeState.generationComplete = true;
        return null;
    },
    
    WORSHIP_PLACES: async (step, { choices, isAutoRolling }) => {
        let numberOfWorshipPlaces = 0;
        
        if (Array.isArray(step.countSource)) { 
            const decision = isAutoRolling ? rollOnTable(step.countSource) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: `Select presence of worship places for this ${choices.type.name}:`,
                choices: step.countSource.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                loop: false,
            }])).choice;
            numberOfWorshipPlaces = decision.count || 0;

        } else { 
            const sizeName = choices.size.name;
            let countDataKey = Object.keys(step.countSource).find(key => key.includes(sizeName));
            if (!countDataKey) countDataKey = Object.keys(step.countSource)[0]; 
            
            const countData = step.countSource[countDataKey];
            if (typeof countData === 'number') { numberOfWorshipPlaces = countData; }
            else if (typeof countData === 'object') { numberOfWorshipPlaces = rollDice(countData.dieCount, countData.dieSize) + countData.bonus; }
        }

        console.log(`  ${chalk.magenta('Result:')} This ${choices.type.name.toLowerCase()} has ${chalk.white(numberOfWorshipPlaces)} place(s) of worship.`);
        
        if (numberOfWorshipPlaces === 0 || !step.table) {
            return { key: step.key, value: [] };
        }

        const generatedPlaces = [];
        for (let i = 0; i < numberOfWorshipPlaces; i++) {
            console.log(chalk.cyan(`\n    -> Generating Place of Worship #${i + 1}...`));
            
            const worshipSize = isAutoRolling ? rollOnTable(step.table) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: 'Select its size:',
                choices: step.table.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                loop: false,
            }])).choice;
            console.log(`      ${chalk.magenta('Size:')} ${chalk.white(worshipSize.name)}`);
            
            const fervency = isAutoRolling ? rollOnTable(fervencyTable) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: 'Select its fervency:',
                choices: fervencyTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                loop: false,
            }])).choice;
            console.log(`      ${chalk.magenta('Fervency:')} ${chalk.white(fervency.name)}`);
            
            generatedPlaces.push({ size: worshipSize, fervency: fervency });
        }

        return { key: step.key, value: generatedPlaces };
    },
    
    GATHERING_PLACES: async (step, { choices, isAutoRolling }) => {
        let numberOfPlaces = 0;

        if (isAutoRolling) {
            const sizeName = choices.size.name;
            const countData = step.countSource[sizeName];
            if (typeof countData === 'number') {
                numberOfPlaces = countData;
            } else if (typeof countData === 'object') {
                const roll = rollDice(countData.dieCount, countData.dieSize) + countData.bonus;
                numberOfPlaces = Math.max(0, roll);
            }
        } else {
            const answer = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of gathering places:',
                choices: [
                    { name: '0-1 (Typical for Very Small villages)', value: 1 },
                    { name: '1 (Typical for Small villages)', value: 2 },
                    { name: '1-2 (Typical for Medium/Large villages)', value: 3 },
                    { name: '2-3 (Typical for Very Large villages)', value: 4 },
                ],
                loop: false,
            }]);
            
            if (answer.count === 1) numberOfPlaces = rollDice(1, 2) - 1;
            else if (answer.count === 2) numberOfPlaces = 1;
            else if (answer.count === 3) numberOfPlaces = rollDice(1, 2);
            else if (answer.count === 4) numberOfPlaces = rollDice(1, 2) + 1;
        }

        console.log(`  ${chalk.magenta('Result:')} This village has ${chalk.white(numberOfPlaces)} place(s) of gathering.`);
        
        if (numberOfPlaces === 0) {
            return { key: step.key, value: [] };
        }

        const generatedPlaces = [];
        for (let i = 0; i < numberOfPlaces; i++) {
            console.log(chalk.cyan(`\n    -> Generating Place of Gathering #${i + 1}...`));

            const place = isAutoRolling ? rollOnTable(gatheringPlacesTable) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: `Select the type for Gathering Place #${i + 1}:`,
                choices: gatheringPlacesTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                loop: false,
            }])).choice;
            console.log(`      ${chalk.magenta('Type:')} ${chalk.white(place.name)}`);
            generatedPlaces.push(place);
        }

        return { key: step.key, value: generatedPlaces };
    },

    VILLAGE_LOCATIONS: async (step, { choices, isAutoRolling }) => {
        let numberOfLocations = 0;

        if (isAutoRolling) {
            const sizeName = choices.size.name;
            const countData = step.countSource[sizeName];
            if (countData) {
                const roll = rollDice(countData.dieCount, countData.dieSize) + countData.bonus;
                numberOfLocations = Math.max(0, roll);
            }
        } else {
            const answer = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of other locations:',
                choices: [
                    { name: '1 (Typical for Very Small/Small villages)', value: 1 },
                    { name: '2 (Common for Medium villages)', value: 2 },
                    { name: '3 (Common for Large villages)', value: 3 },
                    { name: '4 (Common for Very Large villages)', value: 4 },
                    { name: '5 (Possible for Very Large villages)', value: 5 },
                ],
                loop: false,
            }]);
             numberOfLocations = answer.count;
        }

        console.log(`  ${chalk.magenta('Result:')} This village has ${chalk.white(numberOfLocations)} other location(s).`);

        if (numberOfLocations === 0) {
            return { key: step.key, value: [] };
        }

        const generatedLocations = [];
        for (let i = 0; i < numberOfLocations; i++) {
            console.log(chalk.cyan(`\n    -> Generating Other Location #${i + 1}...`));

            const location = isAutoRolling ? rollOnTable(otherLocationsTable) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: `Select the type for Other Location #${i + 1}:`,
                choices: otherLocationsTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })),
                loop: false, pageSize: 15
            }])).choice;
            
            if (location.name === 'Burned down or abandoned business') {
                console.log(chalk.yellow('      -> A ruined business found! Determining what it used to be...'));
                const filteredTable = otherLocationsTable.filter(l => l.name !== 'Burned down or abandoned business');
                const formerLocation = isAutoRolling ? rollOnTable(filteredTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `What was this business before it was abandoned?`,
                    choices: filteredTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })),
                    loop: false, pageSize: 15
                }])).choice;

                const finalLocation = {
                    name: `${location.name} (Formerly a ${formerLocation.name})`,
                    description: `${location.description} It used to be a ${formerLocation.name.toLowerCase()}.`
                };
                generatedLocations.push(finalLocation);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(finalLocation.name)}`);

            } else {
                generatedLocations.push(location);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(location.name)}`);
            }
        }

        return { key: step.key, value: generatedLocations };
    },

    FARMS_AND_RESOURCES: async (step, { choices, isAutoRolling }) => {
        let numberOfRolls = 0;
        const sizeName = choices.size.name;
        
        if (isAutoRolling) {
            numberOfRolls = step.countSource[sizeName];
        } else {
            const answer = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of farms and resources rolls:',
                choices: [
                    { name: `1 roll (Typical for ${chalk.bold('Very Small')} towns)`, value: 1 },
                    { name: `2 rolls (Typical for ${chalk.bold('Small/Medium')} towns)`, value: 2 },
                    { name: `3 rolls (Typical for ${chalk.bold('Large/Very Large')} towns)`, value: 3 },
                ],
                loop: false,
            }]);
            numberOfRolls = answer.count;
        }

        console.log(`  ${chalk.magenta('Result:')} This town has ${chalk.white(numberOfRolls)} farm(s) and/or resource location(s).`);

        if (numberOfRolls === 0) {
            return { key: step.key, value: [] };
        }

        const generatedResources = [];
        for (let i = 0; i < numberOfRolls; i++) {
            console.log(chalk.cyan(`\n    -> Generating Farm/Resource #${i + 1}...`));

            const resource = isAutoRolling ? rollOnTable(farmsAndResourcesTable) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: `Select the type for Farm/Resource #${i + 1}:`,
                choices: farmsAndResourcesTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                loop: false,
            }])).choice;
            
            if (resource.name !== 'None') {
                generatedResources.push(resource);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(resource.name)}`);
            } else {
                 console.log(`      ${chalk.magenta('Type:')} ${chalk.gray(resource.name)} (No new resource added for this roll)`);
            }
        }

        return { key: step.key, value: generatedResources };
    },

    NON_COMMERCIAL_LOCATIONS: async (step, { choices, isAutoRolling, freeLocations }) => {
        let numberOfLocations = 0;
        const sizeName = choices.size.name;

        if (isAutoRolling) {
            numberOfLocations = step.countSource[sizeName];
        } else {
            const answer = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of non-commercial locations:',
                choices: [
                    { name: `1 (Typical for ${chalk.bold('Very Small')} towns)`, value: 1 },
                    { name: `2 (Typical for ${chalk.bold('Small')} towns)`, value: 2 },
                    { name: `3 (Typical for ${chalk.bold('Medium')} towns)`, value: 3 },
                    { name: `4 (Typical for ${chalk.bold('Large')} towns)`, value: 4 },
                    { name: `5 (Typical for ${chalk.bold('Very Large')} towns)`, value: 5 },
                ],
                loop: false,
            }]);
            numberOfLocations = answer.count;
        }
        
        const generatedTypes = [];
        const freebies = freeLocations.filter(loc => loc.category === 'Non-Commercial');
        
        if (freebies.length > 0) {
            console.log(chalk.yellow(`\n    -> Found ${freebies.length} free non-commercial location(s) from Priority.`));
            freebies.forEach(loc => generatedTypes.push(loc.name));
        }

        const remainingLocations = numberOfLocations - freebies.length;
        console.log(`  ${chalk.magenta('Result:')} This town has ${chalk.white(numberOfLocations)} non-commercial location type(s) (${freebies.length} free, ${remainingLocations > 0 ? remainingLocations : 0} to generate).`);
        
        if (remainingLocations > 0) {
            for (let i = 0; i < remainingLocations; i++) {
                console.log(chalk.cyan(`\n    -> Generating Non-Commercial Location #${generatedTypes.length + 1}...`));
                 const locationType = isAutoRolling ? rollOnTable(nonCommercialLocationTypeTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the type for Non-Commercial Location #${generatedTypes.length + 1}:`,
                    choices: nonCommercialLocationTypeTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}`, value: item.name })),
                    loop: false,
                }])).choice;
                generatedTypes.push(locationType);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(locationType)}`);
            }
        }

        return { key: 'nonCommercialTypes', value: generatedTypes };
    },

    FLESH_OUT_NON_COMMERCIAL: async (step, { choices, isAutoRolling }) => {
        const locations = [];
        const typesToGenerate = choices.nonCommercialTypes || [];
        
        if (typesToGenerate.length === 0) {
            return { key: 'nonCommercialLocations', value: [] };
        }

        for (const type of typesToGenerate) {
            console.log(chalk.cyan(`\n    -> Defining the ${chalk.bold(type)}...`));
            let locationDetails = { type };

            if (type === 'Place of Education') {
                const choice = isAutoRolling ? rollOnTable(placesOfEducationTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the specific type of ${type}:`,
                    choices: placesOfEducationTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                    loop: false,
                }])).choice;
                locationDetails.details = choice;
                console.log(`      ${chalk.magenta('Specifics:')} ${chalk.white(choice.name)}`);
            }
            else if (type === 'Place of Gathering') {
                const choice = isAutoRolling ? rollOnTable(townPlacesOfGatheringTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the specific type of ${type}:`,
                    choices: townPlacesOfGatheringTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                    loop: false,
                }])).choice;
                locationDetails.details = choice;
                console.log(`      ${chalk.magenta('Specifics:')} ${chalk.white(choice.name)}`);
            }
            else if (type === 'Place of Government' || type === 'Town Hall') {
                const choice = isAutoRolling ? rollOnTable(placesOfGovernmentTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the specific type of ${type}:`,
                    choices: placesOfGovernmentTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                    loop: false,
                }])).choice;
                locationDetails.details = choice;
                console.log(`      ${chalk.magenta('Specifics:')} ${chalk.white(choice.name)}`);
            }
            else if (type === 'Place of Worship') {
                const size = isAutoRolling ? rollOnTable(townPlaceOfWorshipSizeTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: 'Select its size:',
                    choices: townPlaceOfWorshipSizeTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                    loop: false,
                }])).choice;

                const fervency = isAutoRolling ? rollOnTable(townFervencyTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: 'Select its fervency:',
                    choices: townFervencyTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                    loop: false,
                }])).choice;

                const alignment = isAutoRolling ? rollOnTable(alignmentOfTheFaithTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: 'Select its alignment:',
                    choices: alignmentOfTheFaithTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })),
                    loop: false,
                }])).choice;
                
                locationDetails.details = { size, fervency, alignment };
                console.log(`      ${chalk.magenta('Size:')} ${chalk.white(size.name)}`);
                console.log(`      ${chalk.magenta('Fervency:')} ${chalk.white(fervency.name)}`);
                console.log(`      ${chalk.magenta('Alignment:')} ${chalk.white(alignment.name)}`);
            }
            locations.push(locationDetails);
        }
        return { key: 'nonCommercialLocations', value: locations };
    },

    COMMERCIAL_LOCATIONS: async (step, { choices, isAutoRolling }) => {
        let numberOfLocations = 0;
        let sizeForCommerce = choices.size.name;

        if (choices.priority?.rules?.commercialLocations?.sizeCategoryIncrease) {
            const sizeOrder = ['Very Small', 'Small', 'Medium', 'Large', 'Very Large'];
            const currentIndex = sizeOrder.indexOf(sizeForCommerce);
            const newIndex = Math.min(currentIndex + 1, sizeOrder.length - 1);
            sizeForCommerce = sizeOrder[newIndex];
            console.log(chalk.yellow(`      -> Economic Priority has increased the effective size for commerce to: ${chalk.white(sizeForCommerce)}`));
        }
        
        if (isAutoRolling) {
            numberOfLocations = step.countSource[sizeForCommerce];
        } else {
            const answer = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of commercial locations:',
                choices: [
                    { name: `4 (Typical for ${chalk.bold('Very Small')} towns)`, value: 4 },
                    { name: `6 (Typical for ${chalk.bold('Small')} towns)`, value: 6 },
                    { name: `8 (Typical for ${chalk.bold('Medium')} towns)`, value: 8 },
                    { name: `10 (Typical for ${chalk.bold('Large')} towns)`, value: 10 },
                    { name: `12 (Typical for ${chalk.bold('Very Large')} towns)`, value: 12 },
                ],
                loop: false,
            }]);
            numberOfLocations = answer.count;
        }

        console.log(chalk.bold.cyan(`\nThis town has a total of ${numberOfLocations} commercial locations.`));
        let numberOfShops = 0;

        if (isAutoRolling) {
            for (let i = 0; i < numberOfLocations; i++) {
                if (rollDice(1, 6) <= 3) {
                    numberOfShops++;
                }
            }
        } else {
            console.log(chalk.cyan(`Now, let's determine how many of those are shops versus services.`));
            const shopChoices = Array.from({ length: numberOfLocations + 1 }, (_, i) => ({ name: `${i} Shops`, value: i }));
            const answer = await inquirer.prompt([{
                type: 'list',
                name: 'shopCount',
                message: `How many of the ${numberOfLocations} commercial locations should be Shops?`,
                choices: shopChoices,
                loop: false,
            }]);
            numberOfShops = answer.shopCount;
        }
        const numberOfServices = numberOfLocations - numberOfShops;

        console.log(`  ${chalk.magenta('Result:')} This town has ${chalk.white(numberOfShops)} shop(s) and ${chalk.white(numberOfServices)} service(s).`);

        const generatedShops = [];
        if (numberOfShops > 0) {
            console.log(chalk.bold.cyan(`\n--- Selecting Shops ---`));
            for (let i = 0; i < numberOfShops; i++) {
                console.log(chalk.cyan(`\n    -> Generating Shop #${i + 1}...`));
                const shop = isAutoRolling ? rollOnTable(shopsTable, 100) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select Shop #${i + 1}:`,
                    choices: shopsTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })),
                    pageSize: 15,
                    loop: false,
                }])).choice;
                
                const shopResult = { item: shop };
                if (shop.name.includes('Hired Help')) {
                    shopResult.size = await getHiredHelpSize(isAutoRolling);
                }
                generatedShops.push(shopResult);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(shop.name)}`);
                if(shopResult.size) console.log(`        ${chalk.magenta('Size:')} ${chalk.white(shopResult.size.name)}`);
            }
        }

        const generatedServices = [];
        if (numberOfServices > 0) {
            console.log(chalk.bold.cyan(`\n--- Selecting Services ---`));
             for (let i = 0; i < numberOfServices; i++) {
                console.log(chalk.cyan(`\n    -> Generating Service #${i + 1}...`));
                const service = isAutoRolling ? rollOnTable(servicesTable, 100) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select Service #${i + 1}:`,
                    choices: servicesTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })),
                    pageSize: 15,
                    loop: false,
                }])).choice;
                
                const serviceResult = { item: service };
                if (service.name.includes('Hired Help')) {
                    serviceResult.size = await getHiredHelpSize(isAutoRolling);
                }
                generatedServices.push(serviceResult);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(service.name)}`);
                if(serviceResult.size) console.log(`        ${chalk.magenta('Size:')} ${chalk.white(serviceResult.size.name)}`);
            }
        }

        return { key: step.key, value: { shops: generatedShops, services: generatedServices } };
    },

    OUTSIDE_THE_CITY: async (step, { choices, isAutoRolling }) => {
        let numberOfRolls = 0;
        const sizeName = choices.size.name;

        if (isAutoRolling) {
            numberOfRolls = step.countSource[sizeName] || 0;
        } else {
            const { count } = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of rolls for features outside the city:',
                choices: [
                    { name: `5 rolls (Typical for ${chalk.bold('Very Small')} cities)`, value: 5 },
                    { name: `4 rolls (Typical for ${chalk.bold('Small')} cities)`, value: 4 },
                    { name: `3 rolls (Typical for ${chalk.bold('Medium')} cities)`, value: 3 },
                    { name: `2 rolls (Typical for ${chalk.bold('Large')} cities)`, value: 2 },
                    { name: `1 roll (Typical for ${chalk.bold('Very Large')} cities)`, value: 1 },
                ],
                loop: false,
            }]);
            numberOfRolls = count;
        }

        console.log(`  ${chalk.magenta('Result:')} This city has ${chalk.white(numberOfRolls)} feature(s) outside its walls.`);

        if (numberOfRolls === 0) {
            return { key: step.key, value: [] };
        }

        const specialRules = choices.priority?.rules?.outsideTheCity;
        const generatedFeatures = [];

        for (let i = 0; i < numberOfRolls; i++) {
            console.log(chalk.cyan(`\n    -> Generating Outside Feature #${i + 1}...`));

            let feature;
            if (i === 0 && specialRules) {
                 if (isAutoRolling) {
                    console.log(chalk.yellow(`      -> Applying 'Production' Priority rule to first roll...`));
                    let roll;
                    do {
                        roll = rollDice(1, specialRules.diceOverride);
                    } while (roll >= specialRules.rerollRange[0] && roll <= specialRules.rerollRange[1]);
                    
                    feature = step.table.find(item => roll >= item.min && roll <= item.max);
                    if (feature) console.log(chalk.gray(`      (Rolled a ${roll} on a d${specialRules.diceOverride}, resulting in "${feature.name}")`));

                 } else {
                    console.log(chalk.yellow(`      -> NOTE: The 'Production' Priority suggests rolling a d10 and rerolling 1-4 for this first feature.`));
                 }
            }
            
            if (!feature) {
                 feature = isAutoRolling ? rollOnTable(step.table) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the feature for Outside Location #${i + 1}:`,
                    choices: step.table.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                    loop: false, pageSize: 15,
                }])).choice;
            }
            
            if (feature && feature.name !== 'None') {
                generatedFeatures.push(feature);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(feature.name)}`);
            } else {
                 console.log(`      ${chalk.magenta('Type:')} ${chalk.gray(feature ? feature.name : 'Invalid Roll')} (No new feature added for this roll)`);
            }
        }

        return { key: step.key, value: generatedFeatures };
    },

    DISTRICTS: async (step, { choices, modifiers, isAutoRolling }) => {
        const numMod = modifiers.numberOfDistricts || 0;
        let numResult;
        if (step.tables && step.tables.number) {
            if (isAutoRolling) {
                const baseRoll = rollDice(1, 20);
                const finalScore = applyModifierAndClamp(baseRoll, numMod, 1, 20);
                numResult = step.tables.number.find(item => finalScore >= item.min && finalScore <= item.max);
            } else {
                const answer = await inquirer.prompt([{
                    type: 'list', name: 'choice', message: 'Select the number of districts:',
                    choices: step.tables.number.map(item => ({ name: `[${item.min}-${item.max}] ${item.value}`, value: item })),
                    loop: false
                }]);
                numResult = answer.choice;
            }
        } else {
            if (isAutoRolling) {
                const baseRoll = rollDice(1, 20);
                const finalScore = applyModifierAndClamp(baseRoll, numMod, 1, 20);
                numResult = numberOfDistrictsTable.find(item => finalScore >= item.min && finalScore <= item.max);
            } else {
                console.log(chalk.gray(`  (Current modifier for this roll is ${numMod >= 0 ? '+' : ''}${numMod})`));
                const answer = await inquirer.prompt([{
                    type: 'list', name: 'choice', message: 'Select the number of districts:',
                    choices: numberOfDistrictsTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })),
                    loop: false,
                }]);
                numResult = answer.choice;
            }
        }

        const totalDistricts = numResult.value;
        console.log(`  ${chalk.magenta('Result:')} The settlement has ${chalk.white(totalDistricts)} districts.`);

        const generatedDistricts = [];
        const freeDistrictName = choices.priority?.rules?.districts?.free || choices.leadership?.rules?.districts?.free;
        if (freeDistrictName) {
            const freeDistrictType = districtTypeTable.find(d => d.name === freeDistrictName);
            if (freeDistrictType) {
                generatedDistricts.push({ type: freeDistrictType, locations: { included: [], notable: [], additional: [] } });
                console.log(chalk.yellow(`      -> Gained a free '${freeDistrictType.name}' district.`));
            }
        }
        
        const remainingDistricts = totalDistricts - generatedDistricts.length;
        const isWaterAdjacent = choices.environment?.name === 'Coastal' || choices.environment?.name === 'River';

        for (let i = 0; i < remainingDistricts; i++) {
             console.log(chalk.cyan(`\n    -> Generating District #${generatedDistricts.length + 1}...`));
             let districtType;
             do {
                districtType = isAutoRolling ? rollOnTable(districtTypeTable) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select the type for District #${generatedDistricts.length + 1}:`,
                    choices: districtTypeTable.map(item => ({ 
                        name: `[${item.dice}] ${chalk.bold(item.name)}`, 
                        value: item,
                        disabled: (item.name === 'Docks' && !isWaterAdjacent) ? 'City is not adjacent to water' : false
                    })),
                    loop: false,
                }])).choice;

                if (districtType.name === 'Docks' && !isWaterAdjacent && isAutoRolling) {
                    console.log(chalk.yellow('      -> Rolled "Docks" but city is not near water. Rerolling...'));
                    continue;
                }
                break;
             } while (true);
             generatedDistricts.push({ type: districtType, locations: { included: [], notable: [], additional: [] } });
             console.log(`      ${chalk.magenta('Type:')} ${chalk.white(districtType.name)}`);
        }

        const conditionOrder = ['Squalid', 'Dilapidated', 'Decent', 'Impressive', 'Magnificent'];
        const generalConditionIndex = conditionOrder.indexOf(choices.generalCondition.name);
        const generalCrimeName = choices.generalCrime ? choices.generalCrime.name : choices.crime.name;
        const crimeOrder = ['Dangerous', 'Frequent', 'Common', 'Uncommon', 'Infrequent'];
        const generalCrimeIndex = crimeOrder.indexOf(generalCrimeName);

        for (const district of generatedDistricts) {
            console.log(chalk.bold.cyan(`\n--- Populating the ${district.type.name} District ---`));
            
            const baseCondMod = modifiers.districtCondition || 0;
            const districtCondMod = district.type.modifiers?.districtCondition || 0;
            const totalCondMod = baseCondMod + districtCondMod;
            let conditionResult;
            if (district.type.rules?.condition?.diceOverride && isAutoRolling) {
                 console.log(chalk.yellow(`      -> Applying '${district.type.name}' special rule to condition roll...`));
                 const specialRoll = rollDice(1, district.type.rules.condition.diceOverride);
                 conditionResult = districtConditionTable.find(item => specialRoll >= item.min && specialRoll <= item.max);
                 console.log(chalk.gray(`      (Rolled a ${specialRoll} on a d${district.type.rules.condition.diceOverride})`));
            } else {
                 const promptMessage = `Select condition for the ${district.type.name} district (Mod: ${totalCondMod >= 0 ? '+' : ''}${totalCondMod}):`;
                 const baseRoll = isAutoRolling ? rollDice(1, 20) : null;
                 const finalScore = isAutoRolling ? applyModifierAndClamp(baseRoll, totalCondMod, 1, 20) : null;
                 conditionResult = isAutoRolling 
                    ? districtConditionTable.find(item => finalScore >= item.min && finalScore <= item.max)
                    : (await inquirer.prompt([{ type: 'list', name: 'choice', message: promptMessage,
                        choices: districtConditionTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })), loop: false }])).choice;
            }
            const finalCondIndex = applyModifierAndClamp(generalConditionIndex, conditionResult.step, 0, conditionOrder.length - 1);
            district.condition = { name: conditionOrder[finalCondIndex], description: `(${conditionResult.name} relative to city)` };
            console.log(`      ${chalk.magenta('Condition:')} ${chalk.white(district.condition.name)} ${chalk.gray(district.condition.description)}`);

            const isResidentialDistrict = district.type.name === 'Slums' || district.type.name === 'Upper Class';
            let housingResult;
            if(isAutoRolling) {
                do {
                    housingResult = rollOnTable(housingTable, 12);
                } while (isResidentialDistrict && housingResult.name === 'None');
            } else {
                const answer = await inquirer.prompt([{ type: 'list', name: 'choice', message: `Select housing level for the ${district.type.name} district:`,
                    choices: housingTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item, disabled: isResidentialDistrict && item.name === 'None' ? 'This district must have housing' : false })), loop: false}]);
                housingResult = answer.choice;
            }
            district.housing = housingResult;
            console.log(`      ${chalk.magenta('Housing:')} ${chalk.white(district.housing.name)}`);
            
            const entryResult = isAutoRolling ? rollOnTable(districtEntryTable, 12) : (await inquirer.prompt([{ type: 'list', name: 'choice', message: `Select entry for the ${district.type.name} district:`,
                choices: districtEntryTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })), loop: false }])).choice;
            district.entry = entryResult;
            console.log(`      ${chalk.magenta('Entry:')} ${chalk.white(district.entry.name)}`);
            
            const condCrimeMod = districtConditionCrimeModifiers[district.condition.name] || 0;
            const entryCrimeMod = district.entry.modifiers?.districtCrime || 0;
            const totalCrimeMod = condCrimeMod + entryCrimeMod;
            const crimePrompt = `Select crime level for the ${district.type.name} district (Mod: ${totalCrimeMod >= 0 ? '+' : ''}${totalCrimeMod}):`;
            const crimeBaseRoll = isAutoRolling ? rollDice(1, 20) : null;
            const crimeFinalScore = isAutoRolling ? applyModifierAndClamp(crimeBaseRoll, totalCrimeMod, 1, 20) : null;
            const crimeResult = isAutoRolling
                ? districtCrimeTable.find(item => crimeFinalScore >= item.min && crimeFinalScore <= item.max)
                : (await inquirer.prompt([{ type: 'list', name: 'choice', message: crimePrompt,
                    choices: districtCrimeTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })), loop: false }])).choice;
            
            const finalCrimeIndex = applyModifierAndClamp(generalCrimeIndex, crimeResult.step, 0, crimeOrder.length - 1);
            district.crime = { name: crimeOrder[finalCrimeIndex], description: `(${crimeResult.name} relative to city)` };
            district.urbanEncounterModifier = crimeDegreesData[district.crime.name]?.urbanEncounter || 0;
            console.log(`      ${chalk.magenta('Crime:')} ${chalk.white(district.crime.name)} ${chalk.gray(district.crime.description)}`);
        
            const notableTable = (step.tables && step.tables.notable) ? step.tables.notable : districtNotableLocationsTable;
            const notabilityReasonTable = (step.tables && step.tables.notability) ? step.tables.notability : null;

            const notableLocationsResult = isAutoRolling ? rollOnTable(notableTable, 10) : (await inquirer.prompt([{ type: 'list', name: 'choice', message: `Select number of notable locations for the ${district.type.name} district:`,
                choices: notableTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item })), loop: false }])).choice;
            district.notableLocationsCount = notableLocationsResult;
            console.log(`      ${chalk.magenta('Notable Locations:')} ${chalk.white(district.notableLocationsCount.name)}`);

            // Initialize location arrays
            district.locations.included = [];
            district.locations.notable = [];
            district.locations.additional = [];

            const includedData = districtData[district.type.name]?.includedLocations;
            if (includedData && Array.isArray(includedData)) {
                for(const loc of includedData) {
                    let locName;
                    if (typeof loc === 'string') {
                        locName = loc;
                    } else if (loc.subTable) {
                        locName = rollOnTable(loc.subTable).name;
                    }
                    if (locName) {
                        const locationDetails = allCityLocations[locName] || { name: locName, category: 'unknown' };
                        district.locations.included.push(locationDetails);
                    }
                }
            }

            const additionalRolls = additionalLocationRollsCount[choices.size.name] || 0;
            const notableCount = district.notableLocationsCount.value;
            const totalNewLocations = additionalRolls + notableCount;

            if (totalNewLocations > 0) {
                 for (let i = 0; i < totalNewLocations; i++) {
                    const isNotable = i < notableCount;
                    const typeLabel = isNotable ? 'Notable' : 'Additional';
                    const colorLabel = isNotable ? chalk.yellow : chalk.magenta;

                    console.log(chalk.cyan(`    -> Generating ${colorLabel(typeLabel)} Location #${isNotable ? i + 1 : i - notableCount + 1}...`));
                    
                    let qualityMod = 0;
                    let reroll;
                    do {
                        reroll = false;
                        const locationTable = districtData[district.type.name]?.additionalLocationsTable;
                        if (!locationTable) break;

                        let rollResult = isAutoRolling ? rollOnTable(locationTable) : (await inquirer.prompt([{
                            type: 'list', name: 'choice', message: 'Select location:',
                            choices: locationTable.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`, value: item }))
                        }])).choice;

                        if (rollResult.quality) {
                            qualityMod += rollResult.quality;
                            reroll = true;
                            console.log(chalk.yellow(`      -> Quality modifier changed by ${rollResult.quality > 0 ? '+' : ''}${rollResult.quality}. Rerolling location...`));
                        } else {
                            let finalLocationName = rollResult.name;
                            if (rollResult.subTable) {
                                const subRoll = rollOnTable(rollResult.subTable);
                                finalLocationName = subRoll.name;
                            }
                            
                            const locationData = allCityLocations[finalLocationName] || { name: finalLocationName, category: 'unknown' };
                            
                            // -- NOTABILITY REASON ROLL ---
                            let notableReason = null;
                            let qualityOverride = null;

                            if (isNotable && notabilityReasonTable) {
                                console.log(chalk.gray(`      -> Determining why ${finalLocationName} is notable...`));
                                let reasonResult = isAutoRolling 
                                    ? rollOnTable(notabilityReasonTable, 100)
                                    : (await inquirer.prompt([{
                                        type: 'list', 
                                        name: 'choice', 
                                        message: `Why is ${finalLocationName} notable?`,
                                        choices: notabilityReasonTable.map(r => ({
                                            name: `[${String(r.min).padStart(2,'0')}-${String(r.max).padStart(3,'0')}] ${r.name}`,
                                            value: r
                                        })),
                                        pageSize: 10,
                                        loop: false
                                    }])).choice;
                                
                                notableReason = reasonResult;
                                if (reasonResult.qualityOverride) {
                                    qualityOverride = reasonResult.qualityOverride;
                                    console.log(chalk.yellow(`        (Quality set to '${qualityOverride.name}' due to ${reasonResult.name})`));
                                }
                            }

                            const locationResult = { 
                                ...locationData, 
                                isNotable, 
                                qualityMod,
                                notableReason,
                                qualityOverride
                            };

                            const targetArray = isNotable ? district.locations.notable : district.locations.additional;
                            targetArray.push(locationResult);

                            console.log(`      ${chalk.magenta('Location:')} ${chalk.white(locationResult.name)} ${qualityMod !== 0 ? chalk.gray(`(Quality ${qualityMod > 0 ? '+' : ''}${qualityMod})`) : ''}`);
                            if(notableReason) {
                                console.log(`        ${chalk.yellow('↳ Notable because:')} ${chalk.white(notableReason.name)}`);
                            }
                        }
                    } while(reroll);
                }
            } else {
                 console.log(chalk.gray('    -> No notable or additional locations to generate for this district.'));
            }
        }
        
        return { key: 'districts', value: generatedDistricts };
    },

    NOTEWORTHY_OFFICIAL: async (step, { isAutoRolling }) => {
        console.log(chalk.cyan(`\n    -> Generating a Noteworthy Official...`));

        const officialTable = step.table || officialsTable;
        const competenceTable = step.subTable || officialCompetenceTable;

        const official = isAutoRolling ? rollOnTable(officialTable) : (await inquirer.prompt([{
            type: 'list', name: 'choice', message: 'Select the official\'s role:',
            choices: officialTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
            loop: false, pageSize: 15,
        }])).choice;
        console.log(`      ${chalk.magenta('Role:')} ${chalk.white(official.name)}`);

        const competence = isAutoRolling ? rollOnTable(competenceTable) : (await inquirer.prompt([{
            type: 'list', name: 'choice', message: 'Select their competence level:',
            choices: competenceTable.map(item => ({ name: `[${item.dice || `${item.min}-${item.max}`}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
            loop: false,
        }])).choice;
        console.log(`      ${chalk.magenta('Competence:')} ${chalk.white(competence.name)}`);

        return { key: step.key, value: { official, competence } };
    },

    GENERATE_LOCATION_QUALITY: async (step, { choices, isAutoRolling }) => {
        if (!choices.districts || choices.districts.length === 0) {
            return null;
        }

        let shouldGenerate = isAutoRolling;
        if (!isAutoRolling) {
            const { confirm } = await inquirer.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: 'Do you want to generate a quality level for each location in the city?',
                default: true,
            }]);
            shouldGenerate = confirm;
        }

        if (!shouldGenerate) {
            console.log(chalk.gray('  Skipping location quality generation.'));
            return null;
        }

        console.log(chalk.bold.cyan(`\n--- Generating Location Quality ---`));

        const locationQualityTable = [
            { min: 1, max: 3, name: 'Poor' },
            { min: 4, max: 9, name: 'Good' },
            { min: 10, max: 11, name: 'Fine' },
            { min: 12, max: 12, name: 'Exceptional' }
        ];

        for (const district of choices.districts) {
            console.log(chalk.cyan(`\n  Processing locations in the ${district.type.name} District...`));
            
            const allLocations = [
                ...district.locations.included,
                ...district.locations.notable,
                ...district.locations.additional
            ];

            for (const location of allLocations) {
                if (location.name.includes('[')) continue;

                let quality;
                // Check for override first (e.g. from Capital Notable Tables)
                if (location.qualityOverride) {
                    quality = location.qualityOverride;
                } else if (isAutoRolling) {
                    quality = rollOnTable(locationQualityTable, 12);
                } else {
                    const { choice } = await inquirer.prompt([{
                        type: 'list',
                        name: 'choice',
                        message: `Select quality for: ${chalk.white(location.name)}`,
                        choices: [
                            { name: '[1-3] Poor', value: { name: 'Poor' } },
                            { name: '[4-9] Good', value: { name: 'Good' } },
                            { name: '[10-11] Fine', value: { name: 'Fine' } },
                            { name: '[12] Exceptional', value: { name: 'Exceptional' } }
                        ],
                        loop: false
                    }]);
                    quality = choice;
                }
                
                if (quality) {
                    location.name = `${location.name} ${chalk.yellow(`[${quality.name}]`)}`;
                }
            }
        }
        return null;
    },

    BENEATH_THE_SURFACE: async (step, { isAutoRolling }) => {
        console.log(chalk.cyan(`\n    -> Determining what's happening beneath the surface...`));

        const intrigue = isAutoRolling ? rollOnTable(step.table) : (await inquirer.prompt([{
            type: 'list', name: 'choice', message: 'Select the hidden intrigue:',
            choices: step.table.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
            loop: false, pageSize: 12
        }])).choice;
        console.log(`      ${chalk.magenta('Intrigue:')} ${chalk.white(intrigue.name)}`);

        const awareness = isAutoRolling ? rollOnTable(step.subTable) : (await inquirer.prompt([{
            type: 'list', name: 'choice', message: 'Select the public\'s awareness level:',
            choices: step.subTable.map(item => ({ name: `[${item.dice}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
            loop: false, pageSize: 12
        }])).choice;
        console.log(`      ${chalk.magenta('Awareness:')} ${chalk.white(awareness.name)}`);

        return { key: step.key, value: { intrigue, awareness } };
    },

    SUB_ROLL_MULTIPLE: async (step, { choices, isAutoRolling }) => {
        let numberOfRolls = 0;
        const sizeName = choices.size.name;

        if (isAutoRolling) {
            numberOfRolls = step.countSource[sizeName] || 0;
        } else {
            const sizeChoices = Object.keys(step.countSource).map(key => ({
                name: `${step.countSource[key]} roll(s) (Typical for ${chalk.bold(key)} capitals)`,
                value: step.countSource[key]
            }));
            const { count } = await inquirer.prompt([{
                type: 'list',
                name: 'count',
                message: 'Select the number of rolls for features outside the capital:',
                choices: sizeChoices,
                loop: false,
            }]);
            numberOfRolls = count;
        }

        console.log(`  ${chalk.magenta('Result:')} This capital has ${chalk.white(numberOfRolls)} feature(s) outside its walls.`);

        if (numberOfRolls === 0) {
            return { key: step.key, value: [] };
        }

        const generatedFeatures = [];
        for (let i = 0; i < numberOfRolls; i++) {
            console.log(chalk.cyan(`\n    -> Generating Outside Feature #${i + 1}...`));

            let feature = isAutoRolling ? rollOnTable(step.table) : (await inquirer.prompt([{
                type: 'list', name: 'choice', message: `Select the feature for Outside Location #${i + 1}:`,
                choices: step.table.map(item => ({ name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}: ${item.description}`, value: item })),
                loop: false, pageSize: 15,
            }])).choice;
            
            if (feature && feature.subTable) {
                console.log(chalk.cyan(`      -> Sub-roll required for "${feature.name}"...`));
                const subRoll = isAutoRolling ? rollOnTable(feature.subTable, feature.subTableDice) : (await inquirer.prompt([{
                    type: 'list', name: 'choice', message: 'Select the sub-option:',
                    choices: feature.subTable.map(item => ({ name: `[${item.min}-${item.max}] ${item.text}`, value: item })),
                    loop: false
                }])).choice;

                feature = { ...feature, name: `${feature.name} (${subRoll.text})` };
            }

            if (feature && feature.name !== 'None') {
                generatedFeatures.push(feature);
                console.log(`      ${chalk.magenta('Type:')} ${chalk.white(feature.name)}`);
            } else {
                console.log(`      ${chalk.magenta('Type:')} ${chalk.gray(feature ? feature.name : 'Invalid Roll')} (No new feature added for this roll)`);
            }
        }

        return { key: step.key, value: generatedFeatures };
    },

    NUMBER_OF_LEADERS: async (step, { isAutoRolling }) => {
        let numberOfLeaders;

        const weightedRoll = () => {
            const roll = Math.random() * 100;
            if (roll < 5) return 1;        
            if (roll < 15) return 2;       
            if (roll < 35) return 3;       
            if (roll < 55) return 4;       
            if (roll < 75) return 5;       
            if (roll < 85) return 6;       
            if (roll < 90) return 7;       
            if (roll < 95) return 8;       
            return 9;                      
        };

        if (isAutoRolling) {
            numberOfLeaders = weightedRoll();
        } else {
            const { choiceMethod } = await inquirer.prompt([{
                type: 'list', name: 'choiceMethod', message: 'How would you like to determine the number of leaders?',
                choices: ['Auto-Roll (Weighted)', 'Manual Selection'], loop: false
            }]);

            if (choiceMethod === 'Auto-Roll (Weighted)') {
                numberOfLeaders = weightedRoll();
            } else {
                const { count } = await inquirer.prompt([{
                    type: 'list', name: 'count', message: 'Select the number of leaders:',
                    choices: Array.from({ length: 9 }, (_, i) => i + 1), loop: false
                }]);
                numberOfLeaders = count;
            }
        }

        console.log(`  ${chalk.magenta('Result:')} The capital has ${chalk.white(numberOfLeaders)} leader(s).`);
        return { key: step.key, value: numberOfLeaders };
    },

    LEADER_DETAILS: async (step, { choices, isAutoRolling }) => {
        const count = choices.numberOfLeaders;
        const leaders = [];

        console.log(chalk.bold.cyan(`\n--- Generating Details for ${count} Leader(s) ---`));

        for (let i = 1; i <= count; i++) {
            console.log(chalk.cyan(`\n  -> Leader #${i}...`));

            let lifestyle;
            if (isAutoRolling) {
                lifestyle = rollOnTable(capitalLifestyleTable);
            } else {
                const { choice } = await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select lifestyle for Leader #${i}:`,
                    choices: capitalLifestyleTable.map(item => ({
                        name: `[${item.min}-${item.max || item.min}] ${chalk.bold(item.name)}`,
                        value: item
                    })), loop: false
                }]);
                lifestyle = choice;
            }
            console.log(`      ${chalk.magenta('Lifestyle:')} ${chalk.white(lifestyle.name)}`);

            let residence;
            const resMod = lifestyle.modifiers?.residence || 0;
            const maxDie = getTableDieSize(capitalResidenceTable);

            if (isAutoRolling) {
                const baseRoll = rollDice(1, maxDie);
                const finalScore = applyModifierAndClamp(baseRoll, resMod, 1, maxDie);
                residence = capitalResidenceTable.find(item => item.dice === finalScore);
                console.log(`      ${chalk.magenta('Residence:')} ${chalk.white(residence.name)} ${chalk.gray(`(Rolled ${baseRoll}, Mod ${resMod >= 0 ? '+' : ''}${resMod})`)}`);
            } else {
                console.log(chalk.gray(`      (Residence modifier from lifestyle: ${resMod >= 0 ? '+' : ''}${resMod})`));
                const { choice } = await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select residence for Leader #${i}:`,
                    choices: capitalResidenceTable.map(item => ({
                        name: `[${item.dice}] ${chalk.bold(item.name)}`,
                        value: item
                    })), loop: false
                }]);
                residence = choice;
            }

            let intent;
            if (isAutoRolling) {
                intent = rollOnTable(capitalIntentTable);
            } else {
                const { choice } = await inquirer.prompt([{
                    type: 'list', name: 'choice', message: `Select intent for Leader #${i}:`,
                    choices: capitalIntentTable.map(item => ({
                        name: `[${item.min}-${item.max}] ${chalk.bold(item.name)}`,
                        value: item
                    })), loop: false
                }]);
                intent = choice;
            }
            console.log(`      ${chalk.magenta('Intent:')} ${chalk.white(intent.name)}`);

            leaders.push({
                id: i,
                lifestyle: lifestyle,
                residence: residence,
                intent: intent
            });
        }

        return { key: step.key, value: leaders };
    },

    NOTABLE_VISITORS: async (step, { isAutoRolling }) => {
        console.log(chalk.cyan(`\n    -> Determining Notable Visitors...`));

        // 1. Count
        let count;
        if (isAutoRolling) {
            count = rollOnTable(step.countTable, 4).value;
        } else {
            const { choice } = await inquirer.prompt([{
                type: 'list', name: 'choice', message: 'Select the number of notable visitors:',
                choices: step.countTable.map(item => ({ name: `[${item.dice}] ${item.name}`, value: item.value })),
                loop: false
            }]);
            count = choice;
        }
        console.log(`      ${chalk.magenta('Number of Visitors:')} ${chalk.white(count)}`);

        if (count === 0) return { key: step.key, value: [] };

        // 2. Details for each visitor
        const visitors = [];
        for (let i = 1; i <= count; i++) {
            console.log(chalk.cyan(`      -> Generating Visitor #${i}...`));
            
            let role, reason;
            if (isAutoRolling) {
                role = rollOnTable(step.roleTable, 20);
                reason = rollOnTable(step.reasonTable, 20);
            } else {
                const roleChoice = await inquirer.prompt([{
                    type: 'list', name: 'role', message: `Select role for Visitor #${i}:`,
                    choices: step.roleTable.map(item => ({ name: `[${item.dice}] ${item.name}`, value: item })),
                    loop: false, pageSize: 10
                }]);
                role = roleChoice.role;

                const reasonChoice = await inquirer.prompt([{
                    type: 'list', name: 'reason', message: `Select reason for Visitor #${i}:`,
                    choices: step.reasonTable.map(item => ({ name: `[${item.dice}] ${item.name}`, value: item })),
                    loop: false, pageSize: 10
                }]);
                reason = reasonChoice.reason;
            }

            console.log(`        ${chalk.magenta('Role:')} ${chalk.white(role.name)}`);
            console.log(`        ${chalk.magenta('Reason:')} ${chalk.white(reason.name)}`);

            visitors.push({ id: i, role, reason });
        }

        return { key: step.key, value: visitors };
    },

    NOBILITY_RELATION_PEOPLE: async (step, { isAutoRolling, modifiers }) => {
        console.log(chalk.cyan(`\n    -> Determining relationship with the people...`));
        
        // 1. Determine Relationship
        let relationship;
        if (isAutoRolling) {
            relationship = rollOnTable(capitalNobilityPeopleRelationTable, 20);
        } else {
            const { choice } = await inquirer.prompt([{
                type: 'list', name: 'choice', message: 'Select the relationship with the people:',
                choices: capitalNobilityPeopleRelationTable.map(item => ({ name: `[${item.min}-${item.max}] ${item.name}: ${item.description}`, value: item })),
                loop: false, pageSize: 10
            }]);
            relationship = choice;
        }
        console.log(`      ${chalk.magenta('Relationship:')} ${chalk.white(relationship.name)}`);

        // 2. Determine Root Cause based on Positive/Negative
        let root;
        if (isAutoRolling) {
            root = rollOnTable(capitalNobilityRootTable, 10);
        } else {
             const { choice } = await inquirer.prompt([{
                type: 'list', name: 'choice', message: 'Select the root cause of this relationship:',
                choices: capitalNobilityRootTable.map(item => ({ name: `[${item.min}-${item.max}] ${item.name}`, value: item })),
                loop: false
            }]);
            root = choice;
        }
        
        const rootDescription = relationship.isPositive ? root.positive : root.negative;
        const rootContext = relationship.isPositive ? 'Positive' : 'Negative';
        
        // Apply modifiers if any
        if (root.modifiers) {
            const mods = relationship.isPositive ? root.modifiers.positive : root.modifiers.negative;
            if (mods) {
                for (const [key, value] of Object.entries(mods)) {
                    modifiers[key] = (modifiers[key] || 0) + value; 
                    console.log(chalk.gray(`      (Applied modifier: ${key} ${value >= 0 ? '+' : ''}${value})`));
                }
            }
        }

        console.log(`      ${chalk.magenta('Root Cause:')} ${chalk.white(root.name)} (${chalk.gray(rootContext)})`);
        console.log(`      ${chalk.gray(rootDescription)}`);

        return { key: step.key, value: { relationship, root, rootDescription } };
    },

    NOBILITY_COUNTS: async (step, { isAutoRolling }) => {
        console.log(chalk.bold.cyan(`\n    -> Determining Nobility Counts & Details...`));
        
        // 1. Primary Nobles Count
        let primaryCount;
        if (isAutoRolling) {
            primaryCount = rollOnTable(step.table, 20).value;
        } else {
            const { choice } = await inquirer.prompt([{
                type: 'list', name: 'choice', message: 'Select the number of Primary Nobles:',
                choices: step.table.map(item => ({ name: `[${item.min}-${item.max}] ${item.name}`, value: item.value })),
                loop: false
            }]);
            primaryCount = choice;
        }
        console.log(`      ${chalk.magenta('Primary Nobles Count:')} ${chalk.white(primaryCount)}`);

        // --- Generate Primary Nobles Details ---
        const primaryNobles = [];
        if (primaryCount > 0) {
            console.log(chalk.cyan(`      -> Generating details for ${primaryCount} Primary Nobles...`));
            for (let i = 1; i <= primaryCount; i++) {
                // Lifestyle
                const lifestyle = rollOnTable(capitalLifestyleTable);
                // Residence (with modifier)
                const resMod = lifestyle.modifiers?.residence || 0;
                const maxDie = getTableDieSize(capitalResidenceTable);
                const baseRoll = rollDice(1, maxDie);
                const finalScore = applyModifierAndClamp(baseRoll, resMod, 1, maxDie);
                const residence = capitalResidenceTable.find(item => item.dice === finalScore);
                // Intent
                const intent = rollOnTable(capitalIntentTable);

                primaryNobles.push({ id: i, lifestyle, residence, intent });
                console.log(`        ${chalk.gray(`Noble #${i}: ${lifestyle.name}, ${residence.name}, ${intent.name}`)}`);
            }
        }

        // 2. Lesser Nobles
        let lesserCount = 0;
        let lesserNobles = [];
        let generateLesser = isAutoRolling; 

        if (!isAutoRolling) {
             const { confirm } = await inquirer.prompt([{
                type: 'confirm', name: 'confirm', message: 'Do you want to generate Lesser Nobles as well?', default: true
            }]);
            generateLesser = confirm;
        }

        if (generateLesser) {
            if (isAutoRolling) {
                lesserCount = rollOnTable(step.table, 20).value;
            } else {
                const { choice } = await inquirer.prompt([{
                    type: 'list', name: 'choice', message: 'Select the number of Lesser Nobles:',
                    choices: step.table.map(item => ({ name: `[${item.min}-${item.max}] ${item.name}`, value: item.value })),
                    loop: false
                }]);
                lesserCount = choice;
            }
            console.log(`      ${chalk.magenta('Lesser Nobles Count:')} ${chalk.white(lesserCount)}`);

             // --- Generate Lesser Nobles Details ---
             if (lesserCount > 0) {
                console.log(chalk.cyan(`      -> Generating details for ${lesserCount} Lesser Nobles...`));
                for (let i = 1; i <= lesserCount; i++) {
                    const lifestyle = rollOnTable(capitalLifestyleTable);
                    const resMod = lifestyle.modifiers?.residence || 0;
                    const maxDie = getTableDieSize(capitalResidenceTable);
                    const baseRoll = rollDice(1, maxDie);
                    const finalScore = applyModifierAndClamp(baseRoll, resMod, 1, maxDie);
                    const residence = capitalResidenceTable.find(item => item.dice === finalScore);
                    const intent = rollOnTable(capitalIntentTable);
    
                    lesserNobles.push({ id: i, lifestyle, residence, intent });
                    console.log(`        ${chalk.gray(`Noble #${i}: ${lifestyle.name}, ${residence.name}, ${intent.name}`)}`);
                }
            }
        } else {
            console.log(chalk.gray(`      (Skipping Lesser Nobles generation)`));
        }

        return { key: step.key, value: { primaryCount, lesserCount, primaryNobles, lesserNobles } };
    }
};

// --- SUMMARY AND EXPORT FUNCTIONS ---

function displaySummary(choices, settlementName, rollDetails, currentModifiers, freeLocations) {
    console.log(chalk.bold.yellow('\n\n================================'));
    console.log(chalk.bold.yellow('   Final Settlement Summary   '));
    console.log(chalk.bold.yellow('================================\n'));

    console.log(`${chalk.bold.cyan('Name:')} ${chalk.bold.yellowBright(settlementName)}`);
    console.log(`${chalk.bold.cyan('Type:')} ${chalk.white(choices.type.name)}`);

    for (const key in choices) {
        if (key === 'type' || key === 'nonCommercialTypes' || key === 'numberOfLeaders') continue;
        const choice = choices[key];
        const keyName = formatKeyName(key);
        if (Array.isArray(choice)) {
            // Special handling for array of leaders
            if (key === 'leaderDetails') {
                console.log(chalk.bold.cyan(`\n--- Government Officials (${choice.length}) ---`));
                choice.forEach(leader => {
                    console.log(chalk.green(`  - Leader #${leader.id}:`));
                    console.log(`    ${chalk.magenta('↳ Lifestyle:')} ${chalk.white(leader.lifestyle.name)}`);
                    console.log(`    ${chalk.magenta('↳ Residence:')} ${chalk.white(leader.residence.name)}`);
                    console.log(`    ${chalk.magenta('↳ Intent:')} ${chalk.white(leader.intent.name)}`);
                });
                continue;
            }
            // Special handling for notable visitors
            if (key === 'notableVisitors') {
                console.log(chalk.bold.cyan(`\n--- Notable Visitors (${choice.length}) ---`));
                choice.forEach(visitor => {
                    console.log(chalk.green(`  - Visitor #${visitor.id}:`));
                    console.log(`    ${chalk.magenta('↳ Role:')} ${chalk.white(visitor.role.name)}`);
                    console.log(`    ${chalk.magenta('↳ Reason:')} ${chalk.white(visitor.reason.name)}`);
                });
                continue;
            }

            console.log(chalk.bold.cyan(`\n--- ${keyName} ---`));
            if (choice.length === 0) {
                console.log(chalk.gray('  (None)'));
                continue;
            }

            if (key === 'hardships') {
                if (choice[0].type.name === 'No Hardship') {
                    console.log(chalk.gray('  (None)'));
                } else {
                    choice.forEach((hardship, index) => {
                        console.log(`${chalk.green(`  - Hardship #${index + 1}:`)} ${chalk.white(hardship.type.name)}`);
                        hardship.outcomes.forEach(o => {
                            console.log(`    ${chalk.magenta('↳')} For ${chalk.cyan(formatKeyName(o.attribute))}, they suffered ${chalk.white(o.outcome.name)}`);
                        });
                    });
                }
            } else if (key === 'worshipPlaces') {
                choice.forEach((place, index) => {
                    console.log(`${chalk.green(`  - Place of Worship #${index + 1}:`)}`);
                    console.log(`    ${chalk.magenta('↳ Size:')} ${chalk.white(place.size.name)}`);
                    console.log(`    ${chalk.magenta('↳ Fervency:')} ${chalk.white(place.fervency.name)}`);
                });
            } else if (key === 'gatheringPlaces' || key === 'villageLocations' || key === 'farmsAndResources' || key === 'outsideTheCity' || key === 'outsideTheCapital') {
                 choice.forEach((place, index) => {
                    console.log(`${chalk.green(`  - Feature #${index + 1}:`)} ${chalk.white(place.name)}`);
                });
            } else if (key === 'districts') {
                choice.forEach((district, index) => {
                    console.log(`${chalk.green(`\n  - District #${index + 1}:`)} ${chalk.bold.white(district.type.name)}`);
                    console.log(`    ${chalk.magenta('↳ Housing:')} ${chalk.white(district.housing.name)}`);
                    console.log(`    ${chalk.magenta('↳ Entry:')} ${chalk.white(district.entry.name)}`);
                    console.log(`    ${chalk.magenta('↳ Condition:')} ${chalk.white(district.condition.name)} ${chalk.gray(district.condition.description)}`);
                    console.log(`    ${chalk.magenta('↳ Crime:')} ${chalk.white(district.crime.name)} ${chalk.gray(district.crime.description)}`);
                    console.log(`    ${chalk.magenta('↳ Notable Locations Count:')} ${chalk.white(district.notableLocationsCount.name)}`);
                    
                    if(district.locations.included.length > 0) {
                        console.log(`    ${chalk.magenta('↳ Included Locations:')}`);
                        district.locations.included.forEach(loc => console.log(`      ${chalk.green('•')} ${chalk.white(loc.name)}`));
                    }
                     if(district.locations.notable.length > 0) {
                        console.log(`    ${chalk.yellow('↳ Notable Locations:')}`);
                        district.locations.notable.forEach(loc => console.log(`      ${chalk.yellow('•')} ${chalk.white(loc.name)} ${loc.qualityMod !== 0 ? chalk.gray(`(Quality ${loc.qualityMod > 0 ? '+' : ''}${loc.qualityMod})`) : ''}`));
                    }
                    if(district.locations.additional.length > 0) {
                        console.log(`    ${chalk.magenta('↳ Additional Locations:')}`);
                        district.locations.additional.forEach(loc => console.log(`      ${chalk.green('•')} ${chalk.white(loc.name)} ${loc.qualityMod !== 0 ? chalk.gray(`(Quality ${loc.qualityMod > 0 ? '+' : ''}${loc.qualityMod})`) : ''}`));
                    }

                });
            } else if (key === 'nonCommercialLocations') {
                choice.forEach((loc, index) => {
                    if (loc.type === 'Place of Worship') {
                        console.log(`${chalk.green(`  - Location #${index + 1}:`)} ${chalk.white(loc.type)}`);
                        console.log(`    ${chalk.magenta('↳ Size:')} ${chalk.white(loc.details.size.name)}`);
                        console.log(`    ${chalk.magenta('↳ Fervency:')} ${chalk.white(loc.details.fervency.name)}`);
                        console.log(`    ${chalk.magenta('↳ Alignment:')} ${chalk.white(loc.details.alignment.name)}`);
                    } else {
                        console.log(`${chalk.green(`  - Location #${index + 1}:`)} ${chalk.white(loc.details.name)} (${loc.type})`);
                    }
                });
            } else { 
                choice.forEach(entry => {
                    console.log(`${chalk.green('  -')} ${chalk.white(entry.item.name)}`);
                    if (entry.size) console.log(`    ${chalk.magenta('↳ Size:')} ${chalk.gray(entry.size.name)}`);
                });
            }
        } else if (key === 'commercialLocations') {
             console.log(chalk.bold.cyan(`\n--- Shops ---`));
             if (choice.shops.length > 0) {
                choice.shops.forEach(shop => {
                    console.log(`${chalk.green('  -')} ${chalk.white(shop.item.name)}`);
                    if (shop.size) console.log(`    ${chalk.magenta('↳ Size:')} ${chalk.gray(shop.size.name)}`);
                });
             } else {
                console.log(chalk.gray('  (None)'));
             }
             console.log(chalk.bold.cyan(`\n--- Services ---`));
             if (choice.services.length > 0) {
                choice.services.forEach(service => {
                    console.log(`${chalk.green('  -')} ${chalk.white(service.item.name)}`);
                     if (service.size) console.log(`    ${chalk.magenta('↳ Size:')} ${chalk.gray(service.size.name)}`);
                });
             } else {
                console.log(chalk.gray('  (None)'));
             }
        } else if (key === 'noteworthyOfficial') {
            console.log(`${chalk.bold.cyan('\n--- ' + keyName + ' ---')}`);
            console.log(`  ${chalk.cyan('Role:')} ${chalk.white(choice.official.name)}`);
            console.log(`  ${chalk.cyan('Competence:')} ${chalk.white(choice.competence.name)}`);
        } else if (key === 'beneathTheSurface') {
            console.log(chalk.bold.cyan(`\n--- Beneath The Surface ---`));
            console.log(`  ${chalk.cyan('Intrigue:')} ${chalk.white(choice.intrigue.name)}`);
            console.log(`  ${chalk.cyan('Public Awareness:')} ${chalk.white(choice.awareness.name)}`);
        } else if (key === 'nobilityPeopleRelation') {
            console.log(chalk.bold.cyan(`\n--- Relationship with the People ---`));
            console.log(`  ${chalk.cyan('Status:')} ${chalk.white(choice.relationship.name)}`);
            console.log(`  ${chalk.cyan('Root Cause:')} ${chalk.white(choice.root.name)}`);
            console.log(`  ${chalk.gray(choice.rootDescription)}`);
        } else if (key === 'nobilityCounts') {
            console.log(chalk.bold.cyan(`\n--- Nobility Details ---`));
            
            // Primary Nobles Display
            console.log(chalk.bold.white(`  [Primary Nobles: ${choice.primaryCount}]`));
            if (choice.primaryNobles && choice.primaryNobles.length > 0) {
                choice.primaryNobles.forEach(noble => {
                    console.log(chalk.green(`    - Noble #${noble.id}:`));
                    console.log(`      ${chalk.magenta('↳ Lifestyle:')} ${chalk.white(noble.lifestyle.name)}`);
                    console.log(`      ${chalk.magenta('↳ Residence:')} ${chalk.white(noble.residence.name)}`);
                    console.log(`      ${chalk.magenta('↳ Intent:')} ${chalk.white(noble.intent.name)}`);
                });
            } else {
                console.log(chalk.gray('    (None)'));
            }

            // Lesser Nobles Display
            if (choice.lesserCount > 0) {
                console.log(chalk.bold.white(`\n  [Lesser Nobles: ${choice.lesserCount}]`));
                if (choice.lesserNobles && choice.lesserNobles.length > 0) {
                    choice.lesserNobles.forEach(noble => {
                        console.log(chalk.green(`    - Noble #${noble.id}:`));
                        console.log(`      ${chalk.magenta('↳ Lifestyle:')} ${chalk.white(noble.lifestyle.name)}`);
                        console.log(`      ${chalk.magenta('↳ Residence:')} ${chalk.white(noble.residence.name)}`);
                        console.log(`      ${chalk.magenta('↳ Intent:')} ${chalk.white(noble.intent.name)}`);
                    });
                }
            }
        } else if (choice && choice.name) {
            console.log(`${chalk.bold.cyan(keyName + ':')} ${chalk.white(choice.name)}`);
            if(choice.subChoice) {
                console.log(`  ${chalk.magenta('↳ Type:')} ${chalk.white(choice.subChoice.name)}`);
            }
        }
    }
    
    if (freeLocations.length > 0) {
        console.log(chalk.bold.cyan(`\n--- Free Locations (from Priority) ---`));
        freeLocations.forEach(loc => {
            console.log(`${chalk.green('  -')} ${chalk.white(loc.name)} (${loc.category})`);
        });
    }

    console.log(chalk.bold.yellow('\n\n--- Background Modifier Tracking ---'));
    for (const key in rollDetails) {
        const details = rollDetails[key];
        const keyName = formatKeyName(key);
        if (details.final !== undefined) {
            const modifierText = details.modifier >= 0 ? `+${details.modifier}` : `${details.modifier}`;
            console.log(`${chalk.cyan(keyName + ' Roll:')} ${chalk.white(details.base)} | ${chalk.magenta('Modifier:')} ${chalk.white(modifierText)} | ${chalk.green('Final:')} ${chalk.white(details.final)}`);
        }
    }
    for (const key in currentModifiers) {
        const keyName = formatKeyName(key);
        const modifierText = currentModifiers[key] >= 0 ? `+${currentModifiers[key]}` : `${currentModifiers[key]}`;
        console.log(`${chalk.gray('Final')} ${chalk.cyan(keyName)} ${chalk.gray('Modifier Collected:')} ${chalk.white(modifierText)}`);
    }
    console.log(chalk.bold.yellow('\n================================'));
}

function stripChalk(str) {
    if (typeof str !== 'string') return str;
    return str.replace(/[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g, '');
}

function formatForTxt(choices, settlementName) {
    let output = '';
    const nl = '\n';
    const dbl_nl = '\n\n';

    output += '================================' + nl;
    output += `   ${settlementName}   ` + nl;
    output += '================================' + dbl_nl;
    output += `Type: ${choices.type.name}` + dbl_nl;

    for (const key in choices) {
        if (key === 'type' || key === 'nonCommercialTypes' || key === 'numberOfLeaders') continue;
        const choice = choices[key];
        if (!choice) continue;

        const keyName = formatKeyName(key);
        output += `--- ${keyName.toUpperCase()} ---` + dbl_nl;

        if (Array.isArray(choice)) {
            if (choice.length === 0) {
                output += '(None)' + dbl_nl;
                continue;
            }

            switch (key) {
                case 'districts':
                    choice.forEach((district, index) => {
                        output += `District #${index + 1}: ${district.type.name}` + nl;
                        output += `  Description: ${district.type.description || 'No description'}` + nl;
                        output += `  Housing: ${district.housing.name}` + nl;
                        output += `  Entry: ${district.entry.name}` + nl;
                        output += `  Condition: ${district.condition.name} ${stripChalk(district.condition.description)}` + nl;
                        output += `  Crime: ${district.crime.name} ${stripChalk(district.crime.description)}` + nl;

                        const allLocations = [...district.locations.included, ...district.locations.notable, ...district.locations.additional];
                        if (allLocations.length > 0) {
                            output += '  Locations:' + nl;
                            district.locations.included.forEach(loc => output += `    • ${loc.name} (Included)` + nl);
                            
                            // Format notable locations distinctly for text output
                            district.locations.notable.forEach(loc => {
                                let line = `    • ${loc.name} [NOTABLE]`;
                                if (loc.notableReason) line += ` - Reason: ${loc.notableReason.name}`;
                                output += line + nl;
                            });
                            
                            district.locations.additional.forEach(loc => output += `    • ${loc.name} (Additional)` + nl);
                        }
                        output += nl;
                    });
                    break;
                case 'leaderDetails':
                    choice.forEach(leader => {
                        output += `Leader #${leader.id}:` + nl;
                        output += `  Lifestyle: ${leader.lifestyle.name} - ${leader.lifestyle.description}` + nl;
                        output += `  Residence: ${leader.residence.name} - ${leader.residence.description}` + nl;
                        output += `  Intent: ${leader.intent.name} - ${leader.intent.description}` + nl;
                        output += nl;
                    });
                    break;
                case 'notableVisitors':
                    choice.forEach(visitor => {
                        output += `Visitor #${visitor.id}:` + nl;
                        output += `  Role: ${visitor.role.name}` + nl;
                        output += `  Reason: ${visitor.reason.name} - ${visitor.reason.description}` + nl;
                        output += nl;
                    });
                    break;
                default:
                    choice.forEach(item => {
                        const mainItem = item.item || item;
                        output += `- ${mainItem.name}` + nl;
                        if (mainItem.description) output += `  ${mainItem.description}` + nl;
                    });
                    output += dbl_nl;
                    break;
            }
        } else if (typeof choice === 'object' && choice !== null) {
            switch (key) {
                case 'noteworthyOfficial':
                    output += `Role: ${choice.official.name}` + nl + `  ${choice.official.description}` + nl;
                    output += `Competence: ${choice.competence.name}` + nl + `  ${choice.competence.description}` + dbl_nl;
                    break;
                case 'beneathTheSurface':
                    output += `Intrigue: ${choice.intrigue.name}` + nl + `  ${choice.intrigue.description}` + nl;
                    output += `Awareness: ${choice.awareness.name}` + nl + `  ${choice.awareness.description}` + dbl_nl;
                    break;
                case 'nobilityPeopleRelation':
                    output += `Status: ${choice.relationship.name}` + nl + `  ${choice.relationship.description}` + nl;
                    output += `Root Cause: ${choice.root.name}` + nl + `  ${choice.rootDescription}` + dbl_nl;
                    break;
                case 'nobilityCounts':
                    output += `Primary Nobles Count: ${choice.primaryCount}` + nl;
                    if (choice.primaryNobles) {
                        choice.primaryNobles.forEach(n => {
                             output += `  - Noble #${n.id}: ${n.lifestyle.name}, ${n.residence.name}, ${n.intent.name}` + nl;
                        });
                    }
                    output += nl; 
                    if (choice.lesserCount > 0) {
                        output += `Lesser Nobles Count: ${choice.lesserCount}` + nl;
                        if (choice.lesserNobles) {
                            choice.lesserNobles.forEach(n => {
                                 output += `  - Noble #${n.id}: ${n.lifestyle.name}, ${n.residence.name}, ${n.intent.name}` + nl;
                            });
                        }
                    }
                    output += dbl_nl;
                    break;
                case 'commercialLocations':
                    output += 'Shops:' + nl;
                    choice.shops.length > 0 ? choice.shops.forEach(s => output += `- ${s.item.name}` + nl) : output += '(None)' + nl;
                    output += nl + 'Services:' + nl;
                    choice.services.length > 0 ? choice.services.forEach(s => output += `- ${s.item.name}` + nl) : output += '(None)' + nl;
                    output += dbl_nl;
                    break;
                default:
                    if (choice.name) {
                        output += `${choice.name}` + nl;
                        if (choice.description) output += `  ${choice.description}` + nl;
                        if (choice.subChoice) output += `  ↳ Type: ${choice.subChoice.name} - ${choice.subChoice.description}` + nl;
                        output += dbl_nl;
                    }
                    break;
            }
        }
    }
    return stripChalk(output);
}

async function handleExport(choices, settlementName) {
    const { shouldExport } = await inquirer.prompt([{
        type: 'confirm',
        name: 'shouldExport',
        message: 'Do you want to save the settlement details to a .txt file?',
        default: true,
    }]);

    if (shouldExport) {
        const fileContent = formatForTxt(choices, settlementName);
        const fileName = `${stripChalk(settlementName).replace(/\s+/g, '_')}.txt`;
        try {
            await fs.writeFile(fileName, fileContent);
            console.log(chalk.green(`\nSuccessfully saved settlement data to ${fileName}`));
        } catch (err) {
            console.error(chalk.red('\nError saving file:'), err);
        }
    }
}


async function startAdventure(autoRollEnabled = false) {
    const choices = {};
    const rollDetails = {};
    const freeLocations = [];
    const modifiers = { 
        visitorTraffic: 0, quality: 0, urbanEncounter: 0, prosperity: 0, // Shared
        populationDensity: 0, hardshipLikelihood: 0, condition: 0, disposition: 0, crime: 0, dangerLevel: 0, // Village/Shared
        fortification: 0, lawEnforcement: 0, marketSquare: 0, placeOfWorshipSize: 0, farmsAndResources: 0, defaultInnQuality: 0, populationOverflow: 0, nightActivity: 0, size: 0, populationWealth: 0, // Town/Shared
        numberOfDistricts: 0, districtCondition: 0, districtCrime: 0, // City
        militaryForce: 0, // Capital
        nobilityRelation: 0, // Capital Nobility
    };
    const modeState = { current: autoRollEnabled ? 'autoRollAll' : 'manual', generationComplete: false };

    if (modeState.current === 'autoRollAll') console.log(chalk.bold.magenta('--- Auto-Roll Mode Enabled ---'));
    else console.log(chalk.bold.cyan('Starting the Settlement Generator...'));

    const { settlementType } = await inquirer.prompt([{ type: 'list', name: 'settlementType', message: 'Choose a settlement type to begin:', choices: settlementTypes, loop: false }]);
    choices.type = { name: settlementType };

    const path = settlementPaths[settlementType];

    for (const step of path) {
        if (modeState.generationComplete) break;
        if (step.condition && !step.condition(choices)) continue;

        if (step.title) console.log(chalk.bold.cyan(`\nDetermining ${step.title}...`));

        const processor = stepProcessors[step.type];
        if (processor) {
            const result = await processor(step, {
                choices,
                modifiers,
                isAutoRolling: modeState.current !== 'manual',
                modeState,
                freeLocations
            });

            if (result) {
                choices[result.key] = result.value;
                if (result.value && result.value.modifiers) {
                    for (const key in result.value.modifiers) {
                        if (modifiers.hasOwnProperty(key)) {
                            modifiers[key] += result.value.modifiers[key];
                        }
                    }
                }
                if (result.rollDetail) rollDetails[result.key] = result.rollDetail;
            }
        }
    }

    console.log(chalk.bold.green('\nGeneration complete! Preparing final summary...'));

    const settlementName = generateSettlementName();
    displaySummary(choices, settlementName, rollDetails, modifiers, freeLocations);
    await handleExport(choices, settlementName);
}

export { startAdventure };