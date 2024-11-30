'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/components/ui/use-toast'

export default function Profile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [password, setPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [dataTitle, setDataTitle] = useState('')
  const [dataContent, setDataContent] = useState('')

  useEffect(() => {
    fetchProfile()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setName(user.user_metadata.full_name || '')
      setEmail(user.email || '')
      setContactNo(user.user_metadata.phone || '')
      setAvatarUrl(user.user_metadata.avatar_url || '')
    }
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      email,
      password: password || undefined,
      data: { full_name: name, phone: contactNo }
    })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      })
    }
    setLoading(false)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`${Date.now()}_${file.name}`, file)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to upload avatar. Please try again.",
          variant: "destructive",
        })
      } else if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.path)
        
        setAvatarUrl(publicUrl)
        await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        })
      }
    }
  }

  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const { data, error } = await supabase
      .from('user_data')
      .insert([
        { title: dataTitle, content: dataContent, user_id: supabase.auth.user()?.id }
      ])
    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit data. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Data submitted successfully.",
      })
      setDataTitle('')
      setDataContent('')
    }
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNo">Contact Number</Label>
              <Input
                id="contactNo"
                type="tel"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password to update"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Update Profile</Button>
          </CardFooter>
        </form>
      </Card>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Add New Data</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDataSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="dataTitle">Title</Label>
              <Input
                id="dataTitle"
                value={dataTitle}
                onChange={(e) => setDataTitle(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataContent">Content</Label>
              <textarea
                id="dataContent"
                className="w-full min-h-[100px] px-3 py-2 text-sm rounded-md border border-input"
                value={dataContent}
                onChange={(e) => setDataContent(e.target.value)}
                required
              />
            </div>
            <Button type="submit">Submit Data</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
```[v0-no-op-code-block-prefix]

2. Create a new table in Supabase:
   - Log in to your Supabase project dashboard.
   - Go to the "Table Editor" section.
   - Click on "New Table".
   - Name the table "user_data".
   - Add the following columns:
     - id (type: int8, is identity: true, is primary key: true)
     - created_at (type: timestamptz, default value: now())
     - title (type: text)
     - content (type: text)
     - user_id (type: uuid, foreign key to auth.users(id))
   - Click "Save" to create the table.

3. Set up Row Level Security (RLS):
   - In the Supabase dashboard, go to the "Authentication" > "Policies" section.
   - Find the "user_data" table and click on "New Policy".
   - Choose "Create a policy from scratch".
   - Set the policy name to "Users can insert their own data".
   - For "Allowed operation", select "INSERT".
   - In the "USING expression" field, enter: `auth.uid() = user_id`
   - Click "Review" and then "Save policy".

4. Test the form:
   - Go to your deployed website and navigate to the profile page.
   - Fill out the new form with some test data and submit it.

5. Verify the data in Supabase:
   - Go back to your Supabase project dashboard.
   - Navigate to the "Table Editor" section.
   - Click on the "user_data" table.
   - You should see your newly submitted data in the table.

6. (Optional) Add a data display component:
   To see the data on your website, you can add a component to fetch and display the data.

```typescriptreact type="react" project="Hospital System" file="app/profile/page.tsx"
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/components/ui/use-toast'

export default function Profile() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [contactNo, setContactNo] = useState('')
  const [password, setPassword] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const [userData, setUserData] = useState<Array<{ id: number, title: string, content: string }>>([])

  useEffect(() => {
    fetchProfile()
    fetchUserData()
  }, [])

  async function fetchProfile() {
    setLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      setName(user.user_metadata.full_name || '')
      setEmail(user.email || '')
      setContactNo(user.user_metadata.phone || '')
      setAvatarUrl(user.user_metadata.avatar_url || '')
    }
    setLoading(false)
  }

  async function fetchUserData() {
    const { data, error } = await supabase
      .from('user_data')
      .select('id, title, content')
      .order('created_at', { ascending: false })
  
    if (error) {
      console.error('Error fetching user data:', error)
    } else {
      setUserData(data)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.updateUser({
      email,
      password: password || undefined,
      data: { full_name: name, phone: contactNo }
    })

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully.",
      })
    }
    setLoading(false)
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(`${Date.now()}_${file.name}`, file)

      if (error) {
        toast({
          title: "Error",
          description: "Failed to upload avatar. Please try again.",
          variant: "destructive",
        })
      } else if (data) {
        const { data: { publicUrl } } = supabase.storage
          .from('avatars')
          .getPublicUrl(data.path)
        
        setAvatarUrl(publicUrl)
        await supabase.auth.updateUser({
          data: { avatar_url: publicUrl }
        })
      }
    }
  }

  if (loading) {
    return <div>Loading profile...</div>
  }

  return (
    <div className="container mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Your Submitted Data</CardTitle>
        </CardHeader>
        <CardContent>
          {userData.length > 0 ? (
            <ul className="space-y-4">
              {userData.map((item) => (
                <li key={item.id} className="border-b pb-2">
                  <h3 className="font-semibold">{item.title}</h3>
                  <p>{item.content}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No data submitted yet.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar className="w-20 h-20">
                <AvatarImage src={avatarUrl} alt={name} />
                <AvatarFallback>{name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
              </Avatar>
              <Input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactNo">Contact Number</Label>
              <Input
                id="contactNo"
                type="tel"
                value={contactNo}
                onChange={(e) => setContactNo(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password to update"
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">Update Profile</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
