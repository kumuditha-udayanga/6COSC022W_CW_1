"use client"
import { Navbar } from "@/components/navbar"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { api } from "@/lib/api"
import { toast } from "sonner"
import { Search, MapPin, DollarSign, MessageCircle } from "lucide-react"
import Image from "next/image"
import { Country } from "@/lib/types"

export default function Home() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [country, setCountry] = useState<Country | null>(null)
  const [searching, setSearching] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const response = await api.searchCountry(searchQuery.trim())
      setCountry(response);
    } catch (error: any) {
      // console.log(error);
      if (error.status == 404) {
        toast.error("Country not found")
      } else {
        toast.error(error.response?.data?.message || "Error while fetching country");
      }
      setCountry(null)
    } finally {
      setSearching(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Country Search</h1>
            <p className="text-muted-foreground">Search for any country to get detailed information</p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Search Countries
              </CardTitle>
              <CardDescription>Enter a country name to get information about it</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="flex gap-2">
                <Input
                  placeholder="Enter country name (e.g: France, Japan, Brazil)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" disabled={searching}>
                  {searching ? "Searching..." : "Search"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {country && (
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <Image
                    src={country.nationalFlag.png || "/placeholder.svg"}
                    alt={country.nationalFlag.alt}
                    width={80}
                    height={60}
                    className="rounded border"
                  />
                  <div>
                    <CardTitle className="text-2xl">{country.countryName}</CardTitle>
                    <CardDescription>{country.nationalFlag.alt}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="flex items-center gap-2 font-semibold mb-2">
                        <MapPin className="h-4 w-4" />
                        Capital City
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {country.capitalCity.map((capital, index) => (
                          <Badge key={index} variant="secondary">
                            {capital}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="flex items-center gap-2 font-semibold mb-2">
                        <DollarSign className="h-4 w-4" />
                        Currencies
                      </h3>
                      <div className="space-y-2">
                        {Object.entries(country.currencies).map(([code, currency]) => (
                          <div key={code} className="flex items-center gap-2">
                            <Badge variant="outline">{code}</Badge>
                            <span className="text-sm">
                              {currency.name} ({currency.symbol})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="flex items-center gap-2 font-semibold mb-2">
                      <MessageCircle className="h-4 w-4" />
                      Spoken Languages
                    </h3>
                    <div className="space-y-2">
                      {Object.entries(country.spokenLanguages).map(([code, language]) => (
                        <div key={code} className="flex items-center gap-2">
                          <Badge variant="outline">{code}</Badge>
                          <span className="text-sm">{language}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </main>
  )
}
