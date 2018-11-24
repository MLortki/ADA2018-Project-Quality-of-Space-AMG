# Zurich: a snpashot into Switzerland's economic heart, through the lens of Insurance data.


# Abstract
A 150 word description of the project idea, goals, dataset used. What story you would like to tell and why? What's the motivation behind your project?

Quality of space has been extensively studied across various disciplines as it addresses urgent societal issues of our time. Previous research provides evidence of social, economic and well-being measures being the main influencers. The goal of our project is to present models that can be used to describe quality of space on a postal code level in Switzerland starting from individual insurance customer’s data. Currently different quality of space parameters are often calculated on a much more coarse-grained scale than postal codes (e.g., for regions, provinces or whole countries). Our goal is to complement this information and to provide analysis on a finer scale than previous research. For this project, we will focus on some Swizerland's economic heart: Zurich. 

The information gathered through this model could then be used either by city policy makers or business partners in order to improve societal well-being, through smart city planning. Thus, insurance datasets could provide insight into the panorama of human life through the lens of wellbeing, social cliques, urban safety and they could potentially uncover bigger socio-economic patterns and urban trends. In a sense, this project aims to replace the outdated and costly method of population censuses, to explore the trends and patterns of urban life.


# Research questions
A list of research questions you would like to address during the project. 

- Identification of the most relevant indicators of quality of life in Zurich: building density, crime rate, mobility, green space density.
- Which are the indicators of quality of life that can be best predicted by the insurance data?
- Observation of socio-economic patterns or urban trends in Zurich.


# Dataset
List the dataset(s) you want to use, and some ideas on how do you expect to get, manage, process and enrich it/them. Show us you've read the docs and some examples, and you've a clear idea on what to expect. Discuss data size and format if relevant.

The following datasets will be used:

- Swiss Mobiliar dataset
- data.stadt-zuerich.ch
- OpenStreetMap data, obtained via API if needed

The Swiss Mobiliar dataset is a private collection of anonymized insurance data, which groups information about a client and their house and car. It contains the following schemas: anonymous ID, status of employment, civil status, gender, year of birth, if house is owned or rented, speaking language, nation of origin, zip code of residence, how many children, canton of car matriculation, brand of car, price of car, car cylinder capacity, number of car claims, monetary value of car claims, premium class status of car, zip code of house, insured sum of house, standard of furniture, number of rooms in house, building zip code, insured sum of building, year of construction, type of house, number of claims for house, money of claims, premium class status of house.

There are around 1M entries in the Swiss Mobiliar dataset, however when narrowing to the zip codes of Zurich, the number of entries is reduced to around ????????????.
To evaluate quality of space at the zip code level in Zurich, data is taken from the open source Zurich city dataset. The data is obtained via the website, and the following quantities per zip code area will be of particular interest for this project: number of buildings, number of parks, number of restaurants/cafes/bars, number of sport facilities etc.. Metrics of quality of space will be constructed from these quantities, based on the literature, but we expect to create metrics such as building density or fraction of green space.

To increase modelling robustness, other datasets such as opendata.swiss could also be incorporated. This depends on whether it is possible to find other metrics of quality of life that are evaluated at the zip code level. For example, it would be interesting to use unemployment, crime rate, population density etc.. At this stage, unfortunately no dataset matching these requirements has been found.


# A list of internal milestones up until project milestone 2
Add here a sketch of your planning for the next project milestone.

- Obtaining all of the geolocalized data from the city of Zurich dataset.
- Cleaning, structuring and preparing city of Zurich data for analysis.
- Constructing relevant metrics for quality of life.
- Wrangling of the Insurance dataset: choosing relevant data entries by zip code.
- Looking for zip code level complementary datasets. If found, cleaning and structuring.
- Extracting descriptive statistics for both the Zurich data and the Insurance data (and others if found).
- Dealing with any data inconsistencies, based on descriptive statistics.


# Questions for TAs
Add here some questions you have for us, in general or project-specific.


List of Datasets used (Zurich, zip code level info given as well):

1. Parks - 118 in total
2. Street Lights (Beleuchtung) - 40010 in total
3. Old people center (Alterszentrum) - 28 in total
4. Retirment houses (Alterswohnung) - 36 in total
5. Handicapped parking (Behindertenparkplatz) - 410 in total
6. Fontaines (brunnen) - 1281 in total
7. Youth clubs/centers/ meeting center (Jugendtreff) - 13 in total
8. Kindergarten - 354 in total
9. Kinderhaus / Eltern-Kind-Zentrum - 16 in total
10. Churches (Kirche) - 82 in total
11. Roman-Catholic Parish (Kirchgemeinde Roemisch Katholisch) - (won't be using anymore)
12. Temporary art in the urban space (Kunst im Stadtraum) - 388 in total
13. picknickplatz - 110 in total
14. schulkreis - polygon, won't be using
15. social center (sozial zentrum) - 5 in total
16. Gym (Sporthalle) - 16 in total
17. Stadium  - 1 in total (therefore won't be using)
18. WC handicapped - 28 in total
19. WC not handicapped - 77 in total


- Do you know of any dataset that could complement our quality of space metrics at the zip code level?
