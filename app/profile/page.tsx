'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from '@/components/ui/use-toast'

interface UserData {
  title: string
  content: string
  user_id: string
}

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
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setName(user.user_metadata.full_name || '')
        setEmail(user.email || '')
        setContactNo(user.user_metadata.phone || '')
        setAvatarUrl(user.user_metadata.avatar_url || '')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to fetch profile data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        email,
        password: password || undefined,
        data: { full_name: name, phone: contactNo }
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const newData: UserData = {
        title: dataTitle,
        content: dataContent,
        user_id: user.id
      }

      const { error } = await supabase
        .from('user_data')
        .insert([newData])

      if (error) throw error

      toast({
        title: "Success",
        description: "Data submitted successfully.",
      })
      setDataTitle('')
      setDataContent('')
    } catch (error) {
      console.error('Error submitting data:', error)
      toast({
        title: "Error",
        description: "Failed to submit data. Please try again.",
        variant: "destructive",
      })
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Data'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}'use client'

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
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setName(user.user_metadata.full_name || '')
        setEmail(user.email || '')
        setContactNo(user.user_metadata.phone || '')
        setAvatarUrl(user.user_metadata.avatar_url || '')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
      toast({
        title: "Error",
        description: "Failed to fetch profile data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { error } = await supabase.auth.updateUser({
        email,
        password: password || undefined,
        data: { full_name: name, phone: contactNo }
      })

      if (error) throw error

      toast({
        title: "Success",
        description: "Profile updated successfully.",
      })
    } catch (error) {
      console.error('Error updating profile:', error)
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDataSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No user found')

      const { error } = await supabase
        .from('user_data')
        .insert([
          { 
            title: dataTitle, 
            content: dataContent, 
            user_id: user.id 
          }
        ])

      if (error) throw error

      toast({
        title: "Success",
        description: "Data submitted successfully.",
      })
      setDataTitle('')
      setDataContent('')
    } catch (error) {
      console.error('Error submitting data:', error)
      toast({
        title: "Error",
        description: "Failed to submit data. Please try again.",
        variant: "destructive",
      })
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Profile'}
            </Button>
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
            <Button type="submit" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Data'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
