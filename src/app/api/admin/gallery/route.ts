import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("gallery")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = getSupabase();
  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const captionPt = formData.get("caption_pt") as string | null;
  const captionEn = formData.get("caption_en") as string | null;

  if (!file) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  // Upload to Supabase Storage
  const filename = `${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("band-assets")
    .upload(filename, file);

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  // Get public URL
  const { data: urlData } = supabase.storage
    .from("band-assets")
    .getPublicUrl(filename);

  // Insert into gallery table
  const { data, error } = await supabase
    .from("gallery")
    .insert({
      image_url: urlData.publicUrl,
      caption_pt: captionPt,
      caption_en: captionEn,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

export async function DELETE(request: NextRequest) {
  const supabase = getSupabase();
  const { id, image_url } = await request.json();

  // Delete from storage
  if (image_url) {
    const path = image_url.split("/band-assets/").pop();
    if (path) {
      await supabase.storage.from("band-assets").remove([path]);
    }
  }

  // Delete from database
  const { error } = await supabase.from("gallery").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
