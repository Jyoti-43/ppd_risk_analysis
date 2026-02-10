import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "postpartum depression";

  try {
    // 1. Search for article IDs
    const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(
      query,
    )}&retmode=json&retmax=10`;

    const searchResponse = await fetch(searchUrl);
    const searchData = await searchResponse.json();
    const ids = searchData.esearchresult.idlist;

    if (!ids || ids.length === 0) {
      return NextResponse.json({ articles: [] });
    }

    // 2. Fetch summaries for those IDs
    const summaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi?db=pubmed&id=${ids.join(
      ",",
    )}&retmode=json`;

    const summaryResponse = await fetch(summaryUrl);
    const summaryData = await summaryResponse.json();
    const result = summaryData.result;

    // 3. Transform to match our internal Article format
    const articles = ids.map((id: string) => {
      const entry = result[id];
      // Clean up title (sometimes it has [ ] or other chars)
      const cleanTitle =
        entry.title?.replace(/\[|\]/g, "") || "Untitled Article";

      return {
        id: `pubmed-${id}`,
        title: cleanTitle,
        preview:
          entry.summary ||
          entry.description ||
          entry.articleids?.[0]?.value ||
          "Medical research article from PubMed database.",
        content: entry.summary || "",
        tags: [entry.pubtype?.[0] || "Research", "PubMed"],
        category: "Medical Research",
        imageUrl:
          "https://www.ncbi.nlm.nih.gov/coreutils/nwds/img/logos/ncbi-logo-horizontal.svg",
        external_url: `https://pubmed.ncbi.nlm.nih.gov/${id}/`,
        contributor: {
          name: entry.authors?.[0]?.name || "PubMed Author",
        },
        createdAt: entry.pubdate,
        source: "pubmed",
      };
    });

    return NextResponse.json({ articles });
  } catch (error) {
    console.error("PubMed API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch from PubMed" },
      { status: 500 },
    );
  }
}
