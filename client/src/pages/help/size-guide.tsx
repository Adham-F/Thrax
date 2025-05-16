import { Helmet } from "react-helmet";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function SizeGuidePage() {
  return (
    <>
      <Helmet>
        <title>Size Guide | THRAX</title>
        <meta name="description" content="Find your perfect fit with THRAX's comprehensive size guide for clothing and shoes." />
      </Helmet>

      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        
        <main className="flex-1 container max-w-4xl py-10 px-4 md:px-6 mx-auto">
          <h1 className="text-3xl font-bold mb-6">Size Guide</h1>

          <div className="mb-6">
            <p className="text-muted-foreground">
              Use our size guides to find your perfect fit. Measurements are provided in both inches and centimeters.
              If you're between sizes, we recommend selecting the larger size for a more comfortable fit.
            </p>
          </div>

          <Tabs defaultValue="clothing">
            <TabsList className="mb-6">
              <TabsTrigger value="clothing">Clothing</TabsTrigger>
              <TabsTrigger value="shoes">Shoes</TabsTrigger>
            </TabsList>

            <TabsContent value="clothing">
              <div className="space-y-8">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Men's Clothing</h2>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Size</TableHead>
                            <TableHead>Chest (in)</TableHead>
                            <TableHead>Chest (cm)</TableHead>
                            <TableHead>Waist (in)</TableHead>
                            <TableHead>Waist (cm)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>XS</TableCell>
                            <TableCell>33-34</TableCell>
                            <TableCell>84-86</TableCell>
                            <TableCell>27-28</TableCell>
                            <TableCell>68-71</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>S</TableCell>
                            <TableCell>35-37</TableCell>
                            <TableCell>89-94</TableCell>
                            <TableCell>29-31</TableCell>
                            <TableCell>74-79</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>M</TableCell>
                            <TableCell>38-40</TableCell>
                            <TableCell>97-102</TableCell>
                            <TableCell>32-34</TableCell>
                            <TableCell>81-86</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>L</TableCell>
                            <TableCell>41-43</TableCell>
                            <TableCell>104-109</TableCell>
                            <TableCell>35-37</TableCell>
                            <TableCell>89-94</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>XL</TableCell>
                            <TableCell>44-46</TableCell>
                            <TableCell>112-117</TableCell>
                            <TableCell>38-40</TableCell>
                            <TableCell>97-102</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>XXL</TableCell>
                            <TableCell>47-49</TableCell>
                            <TableCell>119-124</TableCell>
                            <TableCell>41-43</TableCell>
                            <TableCell>104-109</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Women's Clothing</h2>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Size</TableHead>
                            <TableHead>Bust (in)</TableHead>
                            <TableHead>Bust (cm)</TableHead>
                            <TableHead>Waist (in)</TableHead>
                            <TableHead>Waist (cm)</TableHead>
                            <TableHead>Hip (in)</TableHead>
                            <TableHead>Hip (cm)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>XS</TableCell>
                            <TableCell>31-32</TableCell>
                            <TableCell>79-81</TableCell>
                            <TableCell>24-25</TableCell>
                            <TableCell>61-64</TableCell>
                            <TableCell>34-35</TableCell>
                            <TableCell>86-89</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>S</TableCell>
                            <TableCell>33-34</TableCell>
                            <TableCell>84-86</TableCell>
                            <TableCell>26-27</TableCell>
                            <TableCell>66-69</TableCell>
                            <TableCell>36-37</TableCell>
                            <TableCell>91-94</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>M</TableCell>
                            <TableCell>35-36</TableCell>
                            <TableCell>89-91</TableCell>
                            <TableCell>28-29</TableCell>
                            <TableCell>71-74</TableCell>
                            <TableCell>38-39</TableCell>
                            <TableCell>97-99</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>L</TableCell>
                            <TableCell>37-39</TableCell>
                            <TableCell>94-99</TableCell>
                            <TableCell>30-32</TableCell>
                            <TableCell>76-81</TableCell>
                            <TableCell>40-42</TableCell>
                            <TableCell>102-107</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>XL</TableCell>
                            <TableCell>40-42</TableCell>
                            <TableCell>102-107</TableCell>
                            <TableCell>33-35</TableCell>
                            <TableCell>84-89</TableCell>
                            <TableCell>43-45</TableCell>
                            <TableCell>109-114</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="shoes">
              <div className="space-y-8">
                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Men's Shoes</h2>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>US</TableHead>
                            <TableHead>EU</TableHead>
                            <TableHead>UK</TableHead>
                            <TableHead>Foot Length (in)</TableHead>
                            <TableHead>Foot Length (cm)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>7</TableCell>
                            <TableCell>40</TableCell>
                            <TableCell>6</TableCell>
                            <TableCell>9.5</TableCell>
                            <TableCell>24.1</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>8</TableCell>
                            <TableCell>41</TableCell>
                            <TableCell>7</TableCell>
                            <TableCell>9.8</TableCell>
                            <TableCell>24.9</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>9</TableCell>
                            <TableCell>42</TableCell>
                            <TableCell>8</TableCell>
                            <TableCell>10.2</TableCell>
                            <TableCell>25.9</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>10</TableCell>
                            <TableCell>43</TableCell>
                            <TableCell>9</TableCell>
                            <TableCell>10.5</TableCell>
                            <TableCell>26.7</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>11</TableCell>
                            <TableCell>44</TableCell>
                            <TableCell>10</TableCell>
                            <TableCell>10.9</TableCell>
                            <TableCell>27.6</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>12</TableCell>
                            <TableCell>45</TableCell>
                            <TableCell>11</TableCell>
                            <TableCell>11.3</TableCell>
                            <TableCell>28.6</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">Women's Shoes</h2>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>US</TableHead>
                            <TableHead>EU</TableHead>
                            <TableHead>UK</TableHead>
                            <TableHead>Foot Length (in)</TableHead>
                            <TableHead>Foot Length (cm)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>5</TableCell>
                            <TableCell>35</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>8.3</TableCell>
                            <TableCell>21.1</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>6</TableCell>
                            <TableCell>36</TableCell>
                            <TableCell>4</TableCell>
                            <TableCell>8.6</TableCell>
                            <TableCell>21.8</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>7</TableCell>
                            <TableCell>37</TableCell>
                            <TableCell>5</TableCell>
                            <TableCell>9.0</TableCell>
                            <TableCell>22.9</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>8</TableCell>
                            <TableCell>38</TableCell>
                            <TableCell>6</TableCell>
                            <TableCell>9.4</TableCell>
                            <TableCell>23.8</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>9</TableCell>
                            <TableCell>39</TableCell>
                            <TableCell>7</TableCell>
                            <TableCell>9.7</TableCell>
                            <TableCell>24.6</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>10</TableCell>
                            <TableCell>40</TableCell>
                            <TableCell>8</TableCell>
                            <TableCell>10.0</TableCell>
                            <TableCell>25.4</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-10 space-y-4">
            <h2 className="text-xl font-semibold">How to Measure</h2>
            <div>
              <h3 className="font-medium mb-2">Chest/Bust</h3>
              <p className="text-muted-foreground">
                Measure around the fullest part of your chest, keeping the measuring tape horizontal.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Waist</h3>
              <p className="text-muted-foreground">
                Measure around the narrowest part of your natural waistline.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Hip</h3>
              <p className="text-muted-foreground">
                Measure around the fullest part of your hips.
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">Foot Length</h3>
              <p className="text-muted-foreground">
                Measure from the heel to the longest toe while standing with your weight evenly distributed.
              </p>
            </div>
          </div>
        </main>
        
        <SiteFooter />
      </div>
    </>
  );
}