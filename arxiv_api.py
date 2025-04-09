from arxiv import Client, Search
import json
class ArxivAPI():
    def __init__(self):
        self.client = Client()
        self.pdfpath = "pdfs/"
    
    def search(self, query, max_results, sort_by=None):
        search = Search(
            query=query,
            max_results=max_results,
            sort_by=sort_by
        )
        results = self.client.results(search)
        dict_results = []
        count = 0
        for result in results:
            if count >= max_results:
                break
            dict_results.append({
                "entry_id": result.entry_id.split("/")[-1],
                "published": result.published.isoformat() if result.published else None,
                "updated": result.updated.isoformat() if result.updated else None,
                "title": result.title,
                "summary": result.summary,
                "authors": [author.name for author in result.authors],
                "journal_ref": result.journal_ref,
                "links": [link.href for link in result.links],
            })
            count += 1
            
        return dict_results
    
    def save_pdf(self, result, filename):
        entry_id = result["entry_id"]   
        try:
            paper = next(Client().results(Search(id_list=[entry_id])))
            print(type(paper))
            print(paper)
            result = paper.download_pdf(dirpath=self.pdfpath, filename=filename)
            print(result)
            return filename
        except Exception as e:
            print("Error downloading PDF:", e)
            return None
        




        