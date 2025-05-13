import { useState } from "react";
import { Helmet } from "react-helmet";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { 
  InfoIcon, 
  Ruler, 
  ShirtIcon, 
  Footprints
} from "lucide-react";

export default function SizeGuidePage() {
  // Fetch the size guide page content
  const { data: pageContent, isLoading } = useQuery({
    queryKey: ["/api/help-pages/sizeGuide"],
    queryFn: async () => {
      try {
        const res = await apiRequest("GET", "/api/help-pages/sizeGuide");
        return await res.json();
      } catch (error) {
        // Return default if API fails
        return { content: "# Size Guide\n\nReference our size charts to find your perfect fit." };
      }
    }
  });
  
  return (
    <>
      <Helmet>
        <title>Size Guide | THRAX</title>
        <meta name="description" content="Find your perfect fit with our detailed size charts for clothing and footwear." />
      </Helmet>
      
      <div className="flex flex-col min-h-screen">
        <SiteHeader />
        
        <main className="flex-1 container max-w-5xl mx-auto px-4 py-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Size Guide</h1>
              <p className="text-muted-foreground mt-2">
                Find your perfect fit with our detailed size charts.
              </p>
            </div>
            
            <Alert>
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>How to Measure</AlertTitle>
              <AlertDescription>
                For the most accurate measurements, use a soft measuring tape and wear minimal clothing. Stand in a natural position and keep the tape measure snug but not tight.
              </AlertDescription>
            </Alert>
            
            <Tabs defaultValue="clothing" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="clothing" className="flex items-center">
                  <ShirtIcon className="mr-2 h-4 w-4" />
                  <span>Clothing</span>
                </TabsTrigger>
                <TabsTrigger value="pants" className="flex items-center">
                  <Ruler className="mr-2 h-4 w-4" />
                  <span>Pants & Bottoms</span>
                </TabsTrigger>
                <TabsTrigger value="shoes" className="flex items-center">
                  <Footprints className="mr-2 h-4 w-4" />
                  <span>Footwear</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="clothing" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Tops Size Chart</CardTitle>
                    <CardDescription>
                      T-shirts, shirts, sweaters, jackets, and other upper-body garments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Size</TableHead>
                            <TableHead>XS</TableHead>
                            <TableHead>S</TableHead>
                            <TableHead>M</TableHead>
                            <TableHead>L</TableHead>
                            <TableHead>XL</TableHead>
                            <TableHead>XXL</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">US/UK</TableCell>
                            <TableCell>0-2</TableCell>
                            <TableCell>4-6</TableCell>
                            <TableCell>8-10</TableCell>
                            <TableCell>12-14</TableCell>
                            <TableCell>16-18</TableCell>
                            <TableCell>20-22</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">EU</TableCell>
                            <TableCell>32-34</TableCell>
                            <TableCell>36-38</TableCell>
                            <TableCell>40-42</TableCell>
                            <TableCell>44-46</TableCell>
                            <TableCell>48-50</TableCell>
                            <TableCell>52-54</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Chest (inches)</TableCell>
                            <TableCell>32-34</TableCell>
                            <TableCell>35-37</TableCell>
                            <TableCell>38-40</TableCell>
                            <TableCell>41-43</TableCell>
                            <TableCell>44-46</TableCell>
                            <TableCell>47-49</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Chest (cm)</TableCell>
                            <TableCell>81-86</TableCell>
                            <TableCell>87-94</TableCell>
                            <TableCell>95-102</TableCell>
                            <TableCell>103-109</TableCell>
                            <TableCell>110-117</TableCell>
                            <TableCell>118-125</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Waist (inches)</TableCell>
                            <TableCell>26-28</TableCell>
                            <TableCell>29-31</TableCell>
                            <TableCell>32-34</TableCell>
                            <TableCell>35-37</TableCell>
                            <TableCell>38-40</TableCell>
                            <TableCell>41-43</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Waist (cm)</TableCell>
                            <TableCell>66-71</TableCell>
                            <TableCell>72-79</TableCell>
                            <TableCell>80-86</TableCell>
                            <TableCell>87-94</TableCell>
                            <TableCell>95-102</TableCell>
                            <TableCell>103-110</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <h3 className="font-semibold text-lg">How to Measure</h3>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="flex items-start space-x-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">1</span>
                          <div>
                            <h4 className="font-medium">Chest</h4>
                            <p className="text-sm text-muted-foreground">
                              Measure around the fullest part of your chest, keeping the tape measure horizontal.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">2</span>
                          <div>
                            <h4 className="font-medium">Waist</h4>
                            <p className="text-sm text-muted-foreground">
                              Measure around your natural waistline, which is the narrowest part of your torso.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="pants" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Pants & Bottoms Size Chart</CardTitle>
                    <CardDescription>
                      Jeans, trousers, shorts, and other lower-body garments.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Size</TableHead>
                            <TableHead>XS</TableHead>
                            <TableHead>S</TableHead>
                            <TableHead>M</TableHead>
                            <TableHead>L</TableHead>
                            <TableHead>XL</TableHead>
                            <TableHead>XXL</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">US/UK</TableCell>
                            <TableCell>0-2</TableCell>
                            <TableCell>4-6</TableCell>
                            <TableCell>8-10</TableCell>
                            <TableCell>12-14</TableCell>
                            <TableCell>16-18</TableCell>
                            <TableCell>20-22</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Waist (inches)</TableCell>
                            <TableCell>26-28</TableCell>
                            <TableCell>29-31</TableCell>
                            <TableCell>32-34</TableCell>
                            <TableCell>35-37</TableCell>
                            <TableCell>38-40</TableCell>
                            <TableCell>41-43</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Waist (cm)</TableCell>
                            <TableCell>66-71</TableCell>
                            <TableCell>72-79</TableCell>
                            <TableCell>80-86</TableCell>
                            <TableCell>87-94</TableCell>
                            <TableCell>95-102</TableCell>
                            <TableCell>103-110</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Hips (inches)</TableCell>
                            <TableCell>34-36</TableCell>
                            <TableCell>37-39</TableCell>
                            <TableCell>40-42</TableCell>
                            <TableCell>43-45</TableCell>
                            <TableCell>46-48</TableCell>
                            <TableCell>49-51</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Hips (cm)</TableCell>
                            <TableCell>86-91</TableCell>
                            <TableCell>92-99</TableCell>
                            <TableCell>100-107</TableCell>
                            <TableCell>108-114</TableCell>
                            <TableCell>115-122</TableCell>
                            <TableCell>123-130</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">Inseam (inches)</TableCell>
                            <TableCell>30</TableCell>
                            <TableCell>30.5</TableCell>
                            <TableCell>31</TableCell>
                            <TableCell>31.5</TableCell>
                            <TableCell>32</TableCell>
                            <TableCell>32.5</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <h3 className="font-semibold text-lg">How to Measure</h3>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="flex items-start space-x-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">1</span>
                          <div>
                            <h4 className="font-medium">Waist</h4>
                            <p className="text-sm text-muted-foreground">
                              Measure around your natural waistline, keeping the tape measure snug but not tight.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">2</span>
                          <div>
                            <h4 className="font-medium">Hips</h4>
                            <p className="text-sm text-muted-foreground">
                              Measure around the fullest part of your hips, approximately 8 inches below your waistline.
                            </p>
                          </div>
                        </div>
                        <div className="flex items-start space-x-3">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs">3</span>
                          <div>
                            <h4 className="font-medium">Inseam</h4>
                            <p className="text-sm text-muted-foreground">
                              Measure from the crotch seam to the bottom of the leg.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Jeans Size Chart</CardTitle>
                    <CardDescription>
                      Find your perfect fit in our denim collection.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Size (W x L)</TableHead>
                            <TableHead>Waist (inches)</TableHead>
                            <TableHead>Waist (cm)</TableHead>
                            <TableHead>Inseam (inches)</TableHead>
                            <TableHead>Inseam (cm)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="font-medium">28x30</TableCell>
                            <TableCell>28</TableCell>
                            <TableCell>71</TableCell>
                            <TableCell>30</TableCell>
                            <TableCell>76</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">30x32</TableCell>
                            <TableCell>30</TableCell>
                            <TableCell>76</TableCell>
                            <TableCell>32</TableCell>
                            <TableCell>81</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">32x32</TableCell>
                            <TableCell>32</TableCell>
                            <TableCell>81</TableCell>
                            <TableCell>32</TableCell>
                            <TableCell>81</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">34x32</TableCell>
                            <TableCell>34</TableCell>
                            <TableCell>86</TableCell>
                            <TableCell>32</TableCell>
                            <TableCell>81</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">36x34</TableCell>
                            <TableCell>36</TableCell>
                            <TableCell>91</TableCell>
                            <TableCell>34</TableCell>
                            <TableCell>86</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="font-medium">38x34</TableCell>
                            <TableCell>38</TableCell>
                            <TableCell>97</TableCell>
                            <TableCell>34</TableCell>
                            <TableCell>86</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <Alert className="mt-6">
                      <InfoIcon className="h-4 w-4" />
                      <AlertTitle>Jeans Fit Types</AlertTitle>
                      <AlertDescription>
                        We offer multiple fit styles: Skinny, Slim, Regular, Relaxed, and Loose. Each style provides a different look and feel. Check the product description for specific fit details.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="shoes" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Footwear Size Chart</CardTitle>
                    <CardDescription>
                      Find your perfect shoe size with our international conversion chart.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>US (Men)</TableHead>
                            <TableHead>US (Women)</TableHead>
                            <TableHead>UK</TableHead>
                            <TableHead>EU</TableHead>
                            <TableHead>Foot Length (inches)</TableHead>
                            <TableHead>Foot Length (cm)</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>6</TableCell>
                            <TableCell>7.5</TableCell>
                            <TableCell>5.5</TableCell>
                            <TableCell>39</TableCell>
                            <TableCell>9.25</TableCell>
                            <TableCell>23.5</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>7</TableCell>
                            <TableCell>8.5</TableCell>
                            <TableCell>6.5</TableCell>
                            <TableCell>40</TableCell>
                            <TableCell>9.5</TableCell>
                            <TableCell>24.1</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>8</TableCell>
                            <TableCell>9.5</TableCell>
                            <TableCell>7.5</TableCell>
                            <TableCell>41</TableCell>
                            <TableCell>9.75</TableCell>
                            <TableCell>24.8</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>9</TableCell>
                            <TableCell>10.5</TableCell>
                            <TableCell>8.5</TableCell>
                            <TableCell>42</TableCell>
                            <TableCell>10</TableCell>
                            <TableCell>25.4</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>10</TableCell>
                            <TableCell>11.5</TableCell>
                            <TableCell>9.5</TableCell>
                            <TableCell>43</TableCell>
                            <TableCell>10.25</TableCell>
                            <TableCell>26</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>11</TableCell>
                            <TableCell>12.5</TableCell>
                            <TableCell>10.5</TableCell>
                            <TableCell>44</TableCell>
                            <TableCell>10.5</TableCell>
                            <TableCell>26.7</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>12</TableCell>
                            <TableCell>13.5</TableCell>
                            <TableCell>11.5</TableCell>
                            <TableCell>45</TableCell>
                            <TableCell>10.75</TableCell>
                            <TableCell>27.3</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <h3 className="font-semibold text-lg">How to Measure Your Foot</h3>
                      <ol className="space-y-4 list-decimal pl-5">
                        <li>
                          <span className="font-medium">Stand on a piece of paper</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Place a piece of paper on a hard floor. Stand barefoot on the paper with your heel against a wall.
                          </p>
                        </li>
                        <li>
                          <span className="font-medium">Mark your longest toe</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Mark the tip of your longest toe on the paper. This may not always be your big toe.
                          </p>
                        </li>
                        <li>
                          <span className="font-medium">Measure the length</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Measure the distance from the wall to the mark in inches or centimeters.
                          </p>
                        </li>
                        <li>
                          <span className="font-medium">Find your size</span>
                          <p className="text-sm text-muted-foreground mt-1">
                            Use the measurement to find your size in the chart above.
                          </p>
                        </li>
                      </ol>
                      
                      <Alert className="mt-2">
                        <InfoIcon className="h-4 w-4" />
                        <AlertTitle>Sizing Tip</AlertTitle>
                        <AlertDescription>
                          Feet tend to swell throughout the day, so we recommend measuring your feet in the evening for the most accurate size. If you're between sizes, we recommend going up to the next size.
                        </AlertDescription>
                      </Alert>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
            
            {!isLoading && pageContent && (
              <Card>
                <CardContent className="prose dark:prose-invert max-w-none py-6">
                  {/* In a real app, use a markdown renderer here */}
                  <pre className="whitespace-pre-wrap">{pageContent.content}</pre>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
        
        <SiteFooter />
      </div>
    </>
  );
}