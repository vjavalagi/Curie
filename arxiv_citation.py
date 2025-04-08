import arxiv
import re

def make_bibkey(authors, year, title):
    first_author_lastname = authors[0].name.split()[-1].lower()
    short_title_words = title.lower().split()[0:5]
    short_title = re.sub(r'\W+', '', ''.join(short_title_words))  # join first, then clean
    return f"{first_author_lastname}{year}{short_title}"


search = arxiv.Search(id_list=["2212.02947v1"])
result = next(search.results())

authors = ' and '.join([author.name for author in result.authors])
year = result.published.year
title = result.title.strip()
arxiv_id = result.entry_id.split('/')[-1]
primary_class = result.primary_category
bibkey = make_bibkey(result.authors, year, title)

bibtex = f"""@misc{{{bibkey},
  title={{ {title} }},
  author={{ {authors} }},
  year={{ {year} }},
  eprint={{ {arxiv_id.split('v')[0]} }},
  archivePrefix={{arXiv}},
  primaryClass={{ {primary_class} }},
  url={{https://arxiv.org/abs/{arxiv_id} }}, 
}}"""

print(bibtex)
