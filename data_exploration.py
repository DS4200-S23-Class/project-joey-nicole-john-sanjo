import pandas as pd
import matplotlib as plt
from datetime import datetime
import re

filename = 'netflix_titles.csv'

def calc_complexity(string):
    ''' Automated Readability Index '''

    string = string.lower()

    sentence_count = max([len(string.split('.')[:-1]), 1])
    word_count = len(string.split())
    char_count = len(re.sub(r'\W+', '', string))

    return round(4.71 * (char_count / word_count) + 0.5 * (word_count / sentence_count) - 21.43)



def main():

    netflix_df = pd.read_csv(filename)
    netflix_df.set_index('show_id', inplace=True)
    netflix_df.dropna(inplace=True)
    netflix_df = netflix_df[(netflix_df['country'] == 'United States') & (netflix_df['type'] == 'Movie')]

    netflix_df['duration'] = list(map(lambda x: x.split()[0], netflix_df['duration']))
    netflix_df['date_added'] = list(map(lambda x: datetime.strptime(x, '%B %d, %Y').date(),
                                        netflix_df['date_added']))

    netflix_df['complexity'] = list(map(calc_complexity, netflix_df['description']))

    categories = [row.split(',') for row in list(netflix_df['listed_in'])]
    all_categories = sum(categories, [])
    unique_categories = set([cat[1:] if cat[0] == ' ' else cat for cat in all_categories])

    for category in list(unique_categories):
        encoding = list(map(lambda x: 1 if category in x else 0, netflix_df['listed_in']))
        netflix_df[category] = encoding

    netflix_df.drop(columns=['country', 'type', 'description'], inplace=True)
    netflix_df = netflix_df.astype({'complexity':'float'})

    netflix_df.to_csv('testing_3.csv')

















if __name__ == '__main__':
    main()
