---
layout: default
---


Zurich is the largest city in Switzerland settled for over 2000 years. Located at the tip of the lake Zurich, it mesmerizes visitors  and inhabitants with its magnificent landscapes of lake, mountains and rivers. It is a home of numerous  museum and art galleries including, but not limited to, Zurich Museum of Art, Swiss National Museum and Centre le Corbusier. On the either side of the Limmat One can find numerous historic sites such as  Lindenhof and Imperal Palace. Zurich is also cluttered with dozens of churches, parks and gardens.

<br>

Zurich stands out not only with its nature, art and aesthetic qualities, but it is also considered as the hub of Switzerland. Zurich serves as a connection point for railways, buses and airplanes. It is considered as one of the global markets and  as an important financial center despite its small size and population.

<br>

Zurich counts 400,028 inhabitants in total with around 32% of them not being Swiss citizens. Therefore, the city is very diverse and combines people with different cultures, nationalities and heritage. Since there are several popular universities such as ETH and PHW Business school, Zurich is also home for many talented young people as well as professionals with years of experience, families and retired individuals who want to enjoy every second remaining in their life.

<br>

Since Zurich is so diverse in terms of population (ages, backgrounds, nationalities, wealth etc.) and space, some of you may wonder how it is structured. What can we learn from this structure for knowledge transfer or what can we potentially improve for better life in Zurich? To answer these questions we need to identify characteristics and indicators of quality of life and space, study their spatial distribution and connection between indicators. We also need to portray people, their preferences, their life styles. We need to group them and study their groups. Only then, can we investigate indicators and people in one frame, connect groups of people with areas they occupy and search for reasons why. This data story is a bridge between the quality of space and the people who live in the area. This data story, is the story of Zurich. Its people. Its spaces. Its life.

<br>
<br>
<br>

## Quality of Space/Life in Zurich


    How should we divide/structure area of Zurich to study its characteristics? How can we define quality of life and space for identified areas?  What are the metrics we should use?

<br>

Regarding the structure logical solution is to consider official postal areas within Zurich. There are 24 different zip codes in total.

<br>

To identify indicators we utilized the city of Zurich [open database](https://data.stadt-zuerich.ch/dataset), an online repository containing variety of information ranging from surveys to garbage collection schedules in Zurich.


![image-title-here](/assets/images/openDataPipeline.png){:.center-image}

<br>

We selected 35 relevant datasets from all the existing datasets that provided information either on zip code level or on geographic coordinate level that we linked with postal areas. We logically grouped some of the datasets (# of facilities per zip code):

<br>

- Sport facilities: sum of all of the public sport amenities (pools, soccer pitches, volleyball fields, sports halls, etc.)
- Parks: sum of all the public parks and picnic areas
- Child facilities: sum of all children related facilities (elementary schools, kindergartens, nursery schools, etc.)
- Facilities for the elderly: sum of retirement homes, elderly centers, etc.
- Handicapped accessibility: sum of all handicapped equipped toilets and parking spots for the disabled.
- Community facilities: sum of community centers and youth centers.
- Toilets: sum of public handicapped and non-handicapped equipped toilets
- Transport rental: sum of all points of rental of Mobility cars and of PubliBikes.

<!-- <br>

The datasets that we did not group with other datasets include (# of facilities per zip code):

<br>

- Public drinking fountains
- Street art
- Street lights
- Adresses/Buildings
- Hospitality companies
- Police locations -->

<!-- - Population
- addresses
- sports Facilities
- fountains
- Street lights
- Police locations
- parks
- hospitality companies
- Handicapped -->



<br>

We also obtained the population per zip code, using la Poste’s [open database](https://swisspost.opendatasoft.com/explore/dataset/bevoelkerung_proplz/information/?disjunctive.plz&disjunctive.typ&disjunctive.ortbez18&sort=stichdatum).

<br>

Information regarding the most relevant (groups of) datasets is provided below:

<br>
<br>

{% include scripts.html %}


{% include global_map.html %}

<br>

Even though it is useful to know number of facilities per area, sometimes it’s more relevant to have information about accessibility. One way to do this is to find the shortest distance from individual habitations (addresses) to certain facilities. For instance, to measure police accessibility we computed the distance from each address to the closest police location and found the average shortest distance for each zip code. Using this method, average shortest distance to the following facilities were computed:

<br>

- police locations
- parks
- hospitality companies
- handicapped facilities


<br>

Finally, we used all of the features mentioned above to create 5 indicators. It is difficult to estimate how to combine the above metrics into a meaningful composite score, unless one is an expert. To avoid this difficulty, we used a method based on PCA  and inspired by the one used to create [socio-economic status indices](https://academic.oup.com/heapol/article/21/6/459/612115). In this method, relevant subsets of features are chosen. The data is then normalized for each feature and PCA is applied to it. The first component of the analysis is chosen to create the indicator, which is therefore basically a weighted sum of the normalized features.

<br>



<br>
## Zurich indicators

{% include radar_plot.html %}

<br>
<br>
<br>

## Population in Zurich

<!-- {% include age_ridgeplot.html %} -->

    Portray people, their preferences, their life styles in Zurich. Group them and study  their groups.

Since it is hard to obtain big enough population sample of Zurich, we use the Swiss Mobiliar dataset for our data story to characterize people of Zurich. This approach, despite its bias,  was successfully used in approximation of population sample in previous researches, therefore we decided to adopt it.

<br>

The Swiss Mobiliar dataset is a private collection of anonymous insurance data, that groups information about clients, their demographics and properties. It contains the following relevant data:  (we need to choose which ones to keep from list)

- anonymous ID
- status of employment
- civil status
- gender
- year of birth
- if house is owned or rented
- communication language
- nation of origin
- zip code of residence
- how many children
- canton of car matriculation
- brand of car
- price of car
- car cylinder capacity
- number of car claims
- monetary value of car claims
- premium class status of car
- zip code of house
- insured sum of house
- standard of furniture
- number of rooms in house
- building zip code
- insured sum of building
- year of construction
- type of house
- number of claims for house
- money of claims
- premium class status of house

<br><br>

There are around **1M** entries in the Swiss Mobiliar dataset, however when narrowing down to the zip codes of Zurich, the number of entries is reduced to around 50 000.

<br><br>


-  Categorical data exploration <br>
For the categorical data (eg. job state, civil state, nationality) we have about the insurers, we aggregated the information into the percentage of each cateogry within an area. The following is a heatmap visualization of the data.

{% include heatmap.html %}

<br>
<br>
<br>

## Linking the people to the city

    investigate indicators and people in one frame, connect groups of people with areas   they occupy and search for reasons why.

<br>

Now that we have constructed metrics that characterize the city and obtained information about its citizens, we want to link the people to the area that they live in, and understand what are the factors that lead to them living there. We have gathered a lot of features and metrics so far, and there is a lot of information to be extracted. We chose to focalize our spatial analysis to a few points that really stand out. To reveal these elements, we first examine which features correlate to each other. The following heatmap shows the Pearson correlation coefficient between all of the indicators and some mean insurance data features (aggregated to zip code level). The 8001 postal area is an outlier. Being the historical center, it is very well equipped and dense in terms of buildings, hospitality companies etc. It will be removed in this analysis.<br>
<br>
![image-title-here](/assets/images/corr_heatmap.png){:.center-image}
<br>

Some remarks concerning this heatmap:

<br>

- All of the mean insurance customer metrics seem to be positively correlated together. This should be expected, as older customers should earn more, have more cars and larger houses on average.<br>
- Some of the city indicators are positively correlated together. For instance the safety indicator seems to be quite strongly positvely correlated to the hospitality one.<br>
- We see some counterintuitive behavior: the average number of rooms is strongly negatively correlated to the safety indicator. Upon further analysis, and when considering how the safety indicator was constructed, it seems that this safety score is actually measuring proximity to the center. The majority of the police locations are situated in the center of Zurich, and the number of street lights follows a similar pattern. This does not however mean that the suburban postal areas are less safe.<br>


We then focus on a few highly correlated elements, while being aware of the above remarks.<br>
<br>

    Young people tend to be in areas with more hospitality companies (bars, cafés, etc.).

<br>


This correlation was found with r= -0.804502 and p-value= 4e-7.
<br>
<br>
![image-title-here](/assets/images/age_hospitality.png){:.map-image}
<br>
<br>

<br>

    People with more children tend to live further away from hospitality companies and    closer to parks.

<br>

This correlation was found with r=-0.746151 0.566424, p-value=4e-5 5e-3

2 maps side by side.


<br>

    People with more cars seem to live in areas with less restaurants and more sports     facilities.

<br>

r=-0.660992 0.552678, p-value= 5e-4 6e-3
2 maps side by side.

<br>

In general it seems that the wealthier you are, which in general means that you are older and have more cars and a bigger house, the more you live on the outskirts of Zurich, in areas with less cafés, restaurants etc. To mathematically back up this claim we choose to look at the spatial autocorrelation of wealthy people, i.e. we ask the following the question: is there a pattern to the spatial distribution of the wealthy? We can answer performing a spatial analysis using **Moran's I**.

<br>
<br>

Moran's I is a measure of how spatially autocorrelated a variable is, and can be easily [implemented](http://darribas.org/gds15/content/labs/lab_06.html) using the PySAL package. For the average property premium of insurance customers in Zurich, we find a Moran's I of **0.46**, with a p-value of **0.001**. This indicates that there is indeed a pattern to distribution of the wealthy. What then is that pattern? Using PySAL's Local Indicators of Spatial Association (LISAs), we can determine spatial clusters. This is shown in the map below.<br>

<br>
![image-title-here](/assets/images/spatial_clusters.png){:.center-image}
<br>

Surprinsingly, instead of seeing a difference between inner and outer Zurich postal areas, we instead observe a contrast between the eastern and the western postal areas.<br>


## Conclusion
    What can we learn from this structure for knowledge transfer? What can we potentially improve for better life in Zurich?
