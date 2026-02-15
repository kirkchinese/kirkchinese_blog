#!/usr/bin/env python3
"""
为博客文章生成音频版本
使用 Qwen3-TTS Voice Design
"""
import os
import sys

workspace = "/home/misaka/openclaw"
blog_dir = f"{workspace}/kirkchinese_blog"
audio_dir = f"{blog_dir}/public/audio"

sys.path.insert(0, workspace)

def extract_article_content(md_path):
    """从 Markdown 文件提取正文内容"""
    with open(md_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 移除 frontmatter
    lines = content.split('\n')
    content_started = False
    content_lines = []
    
    for line in lines:
        if line.strip() == '---':
            if not content_started:
                content_started = True
                continue
            else:
                break
        if content_started:
            content_lines.append(line)
    
    return '\n'.join(content_lines)

def generate_audio(text, title, output_path):
    """生成音频"""
    try:
        from qwen_tts import Qwen3TTSModel
        import soundfile as sf
        
        # 设置使用 RTX 3080
        os.environ["CUDA_VISIBLE_DEVICES"] = "1"
        
        print(f"⏳ 加载模型...")
        model = Qwen3TTSModel.from_pretrained("Qwen/Qwen3-TTS-12Hz-1.7B-VoiceDesign")
        
        print(f"⏳ 生成音频: {title}")
        wavs, sr = model.generate_voice_design(
            text=text,
            language="Chinese",
            instruct="专业博客播报，语速适中，声音清晰有力，体现夜河阳的特质：清冷利落，沉稳有力量，略带科技感但本质温暖"
        )
        
        # 保存
        sf.write(output_path, wavs[0], sr)
        
        # 计算时长
        duration = len(wavs[0]) / sr
        print(f"✅ 音频已保存: {output_path}")
        print(f"⏱️  时长: {duration/60:.1f} 分钟")
        
        return True
    except Exception as e:
        print(f"❌ 生成失败: {e}")
        return False

# 创建音频目录
os.makedirs(audio_dir, exist_ok=True)

# 获取所有文章
articles = [
    ("night-river-yang-birth.md", "夜河阳的诞生"),
    ("qwen3-tts-tutorial.md", "Qwen3-TTS实战教程"),
    ("spring-festival-globalization.md", "春节的全球化"),
]

print("=" * 60)
print("🎙️ 博客文章音频生成")
print("=" * 60)
print()

for filename, title in articles:
    md_path = f"{blog_dir}/src/content/blog/{filename}"
    audio_filename = filename.replace('.md', '.mp3')
    audio_path = f"{audio_dir}/{audio_filename}"
    
    if not os.path.exists(md_path):
        print(f"⚠️  文章不存在: {filename}")
        continue
    
    print(f"📝 处理: {title}")
    print(f"   文件: {filename}")
    
    # 提取内容
    content = extract_article_content(md_path)
    
    # 如果内容太长，分段处理
    if len(content) > 3000:
        print(f"⚠️  文章过长 ({len(content)} 字符)，截取前3000字符")
        content = content[:3000]
    
    # 生成音频
    if generate_audio(content, title, audio_path):
        print()
    else:
        print(f"❌ {title} 生成失败")
        print()

print("=" * 60)
print("✅ 全部完成！")
print(f"📁 音频目录: {audio_dir}")
