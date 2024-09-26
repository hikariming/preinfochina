from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from openai import OpenAI
import time
import re

# 设置OpenAI API密钥
client = OpenAI(api_key="sk-adafcb026b994fd59d7b6208dc6bd795", base_url="https://api.deepseek.com")

def clean_html(content):
    soup = BeautifulSoup(content, 'html.parser')
    
    # 移除所有script和style标签
    for script in soup(["script", "style"]):
        script.decompose()
    
    # 保留<a>标签的所有属性，移除其他标签的属性
    for tag in soup.find_all(True):
        if tag.name != 'a':
            tag.attrs = {}
    
    # 只保留可能包含演出信息的标签
    relevant_tags = soup.find_all(['a', 'div', 'p', 'span', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'])
    cleaned_html = ' '.join(str(tag) for tag in relevant_tags)
    
    # 移除多余的空白字符
    cleaned_html = re.sub(r'\s+', ' ', cleaned_html).strip()
    
    return cleaned_html

def get_page_content(url):
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        page.goto(url)
        
        # 等待页面加载完成
        page.wait_for_load_state("networkidle")
        
        # 额外等待一些时间，确保动态内容加载完成
        time.sleep(5)
        
        # 获取页面内容
        content = page.content()
        
        # 使用BeautifulSoup解析HTML
        soup = BeautifulSoup(content, 'html.parser')
        
        # 只保留body部分
        body = soup.body
        body_content = str(body) if body else ""
        
        # 使用clean_html函数清理HTML内容
        cleaned_content = clean_html(body_content)
        
        browser.close()
        return cleaned_content

def analyze_page(content):
    # 使用OpenAI API分析页面内容
    response = client.chat.completions.create(
        model="deepseek-chat",
        messages=[
            {"role": "system", "content": "你是一个网页分析助手。请分析给定的HTML内容，提取所有演出信息链接。"},
            {"role": "user", "content": f"分析以下HTML内容，提取所有演出信息链接:\n\n{content}"}
        ]
    )
    return response.choices[0].message.content

def main(start_url):
    content = get_page_content(start_url)
    print("页面body内容（前1000个字符）：")
    print(content[:1000])
    
    links = analyze_page(content)
    print("\nAI分析结果：")
    print(links)
    
    # 如果AI返回的是字符串，我们需要将其转换为列表
    if isinstance(links, str):
        links = links.split('\n')
    
    performance_info = []
    for link in links:
        if link.strip().startswith('http'):
            info = extract_performance_info(link.strip())
            performance_info.append(info)
    
    return performance_info

def extract_performance_info(link):
    # 这个函数需要根据实际情况来实现
    # 这里只是一个示例
    return f"从链接 {link} 提取的演出信息"

# 使用示例
# https://fujiikaze.com/show/ 是可以的
# https://www.aimyong.net/news/3/?page=1
start_url = "https://fujiikaze.com/show/"
results = main(start_url)
for info in results:
    print(info)
    print("---")