# Title

# Abstract
A 150 word description of the project idea, goals, dataset used. What story you would like to tell and why? What's the motivation behind your project?

Quality of space has been extensively studied across various disciplines as it addresses urgent societal issues of our time. Previous research provides evidence of social, economic and well-being measures being the main influencers. The goal of our project is to present models that can be used to describe quality of space on a postal code level in Switzerland starting from individual insurance customer’s data. Currently different quality of space parameters are often calculated on a much more coarse-grained scale than postal codes (e.g., for regions, provinces or whole countries). Our goal is to complement this information and to provide analysis on a finer scale than previous research. For this project, we will focus on some of the main Swiss cities: Zurich, Geneva, and if time allows Lausanne and Bern. 

The information gathered through this model could then be used either by city policy makers or business partners in order to improve societal well-being, through smart city planning. Thus, insurance datasets could provide insight into the panorama of human life through the lens of wellbeing, social cliques, urban safety and they could potentially uncover bigger socio-economic patterns and urban trends.


# Research questions
A list of research questions you would like to address during the project. 

- How to model quality of space on a postal code level in Switzerland?
- How well does quality of life in Swiss cities correlate with insurance data?
- From the insurance data, which of the factors best predict quality of space?
- More specifically, how does modelling (distribution) change across Switzerland’s large cities?
- Can we observe socio-economic patterns or urban trends?


# Dataset
List the dataset(s) you want to use, and some ideas on how do you expect to get, manage, process and enrich it/them. Show us you've read the docs and some examples, and you've a clear idea on what to expect. Discuss data size and format if relevant.

List the dataset(s) you want to use, and some ideas on how do you expect to get, manage, process and enrich it/them. Show us you've read the docs and some examples, and you've a clear idea on what to expect. Discuss data size and format if relevant.
The following datasets will be used:

- Swiss Mobiliar dataset
- OpenStreetMap data, obtained via API
- Possibly opendata.swiss or similar, depending on zip code level availability

The Swiss Mobiliar dataset is a private collection of anonymized insurance data, which groups information about a client and their house and car. It contains the following schemas: anonymous ID, status of employment, civil status, gender, year of birth, if house is owned or rented, speaking language, nation of origin, zip code of residence, how many children, canton of car matriculation, brand of car, price of car, car cylinder capacity, number of car claims, monetary value of car claims, premium class status of car, zip code of house, insured sum of house, standard of furniture, number of rooms in house, building zip code, insured sum of building, year of construction, type of house, number of claims for house, money of claims, premium class status of house.

There are around 1M entries in the Swiss Mobiliar dataset, however when narrowing to the zip codes within the largest Swiss cities, this number will be significantly reduced (the exact number will depend on the number of chosen cities to evaluate).
To evaluate quality of space at the zip code level, data is taken from the open source map dataset OpenStreetMap. The data is obtained via API, and the following quantities per zip code area will be of particular interest for this project: number of buildings, number of parks, number of restaurants/cafes/bars, number of sport facilities etc.. Metrics of quality of space will be constructed from these quantities, based on the literature, but we expect to create metrics such as building density or fraction of green space.

To increase modelling robustness, other datasets such as opendata.swiss could also be incorporated. This depends on whether it is possible to find other metrics of quality of life that are evaluated at the zip code level. For example, it would be interesting to use unemployment, crime rate, population density etc.. At this stage, unfortunately no dataset matching these requirements has been found.


# A list of internal milestones up until project milestone 2
Add here a sketch of your planning for the next project milestone.

- Obtaining OpenStreetMap data via API, containing postal code level statistics in Switzerland. Statistics including, but not limited to, number of parks,  number of restaurants/cafes/bars, number of sporting facilities etc.. 
- Cleaning, structuring and preparing OpenStreetMap data for analysis.
- Constructing relevant metrics for quality of life based on OpenStreetMap data.
- Wrangling of the Insurance dataset: choosing relevant data entries by zip code.
- Looking for zip code level complementary datasets. If found, cleaning and structuring.
- Extracting descriptive statistics for both the OpenStreetMap and the Insurance data (and others if found).
- Dealing with any data inconsistencies, based on descriptive statistics.


# Questions for TAa
Add here some questions you have for us, in general or project-specific.

- Do you know of any dataset that could complement our quality of space metrics at the zip code level, i.e. unemployment rate, crime rate?
