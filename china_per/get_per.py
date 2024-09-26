import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
from appwrite.client import Client
from appwrite.services.databases import Databases
from appwrite.query import Query
import logging
from openai import OpenAI
import json  # 添加这行
import re  # 添加这行
from datetime import datetime  # 添加这行
import sys  # 添加这行
import schedule
import threading

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("performance_scraper.log"),
        logging.StreamHandler(sys.stdout)
    ]
)

# Appwrite 配置
client = Client()
client.set_endpoint('https://cloud.appwrite.io/v1')
client.set_project('66e18c7100141ca37061')
client.set_key('standard_cdbed84bc51bde8d1fb16f4c496d2e8fdf63a104724707ef7b98a8256c93c00af18fd48187a4eb5c70ff2aa8c2bb59a25eef259357d91db9db4c536e7a57e819911947b614b8400c515ae87289fe66efed1656c65252d71ace461055f64165ab3d2ac048aa4ff28e95e2cc87bf84c814c7924a14bb36a0e3c79b91fe621c1c62')

databases = Databases(client)

# 在文件顶部定义 headers
headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
}

def check_performance_exists(info_source_id):
    try:
        result = databases.list_documents(
            database_id='perinfo',
            collection_id='66e56af1001dac90eefb',
            queries=[
                Query.equal('info_source_id', info_source_id)
            ]
        )
        return len(result['documents']) > 0
    except Exception as e:
        logging.error(f"检查演出信息时出错: {e}")
        return True

def extract_info_from_soup(soup, href):
    extracted_info = {}
    
    # 提取信息源ID
    extracted_info['info_source_id'] = href.split('=')[-1]
    
    # 提取中文演出名称
    title_element = soup.find('h2', class_='title')
    if title_element:
        extracted_info['pername_cn'] = title_element.text.strip()
    
    # 提取中文地点和场地
    location_element = soup.find('p', class_='location')
    if location_element:
        location_text = location_element.text.strip()
        # 假设地点和场地用逗号分隔
        location_parts = location_text.split('，')
        if len(location_parts) >= 2:
            extracted_info['location_cn'] = location_parts[0]
            extracted_info['place_cn'] = location_parts[1]
        else:
            extracted_info['location_cn'] = location_text
    
    return extracted_info

def parse_performance_info(performance):
    url = performance['href']
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # 从页面提取信息
        extracted_info = extract_info_from_soup(soup, url)
        
        # 提取网页中的表格信息
        table_info = {}
        table = soup.find('table')
        if table:
            rows = table.find_all('tr')
            for row in rows:
                cols = row.find_all('td')
                if len(cols) == 2:
                    key = cols[0].text.strip().rstrip('')
                    value = cols[1].text.strip()
                    table_info[key] = value
        
        # 使用DeepSeek AI补全信息
        client = OpenAI(api_key="sk-adafcb026b994fd59d7b6208dc6bd795", base_url="https://api.deepseek.com")
        completion = client.chat.completions.create(
            model="deepseek-chat",
            messages=[
                {"role": "system", "content": "你是一个专门解析演出信息的AI助手。请根据提供的信息,生成包含演出名称(中英日)、热度指数、地点(中英日)、开始和结束时间、场地(中英日)、信息来源、标签、艺术家(中英日)和信息源ID的JSON格式数据。"},
                {"role": "user", "content": f"""请根据以下网页信息生成完整的演出信息JSON,格式如下:
{{
  "pername_cn": "{table_info.get('演出名称', '')}",
  "pername_en": "英文演出名称",
  "pername_jp": "日文演出名称",
  "hot_index": 判断一个歌手的热门指数 明确评分标准 0-30: 无人问津到小有名气 30-80: 国内热门 80-100: 全球热门 其他评分依据 社交媒体影响力: 粉丝数量、互动率、话题讨论度 音乐平台数据: 播放量、下载量、专辑销量 演唱会数据: 门票销售情况、上座率、巡演规模 国际影响力: 是否多个国家举办演唱会、是否有国际媒体报道等),
  "location_cn": "{table_info.get('演出地', '')}",
  "location_en": "英文地点",
  "location_jp": "日文地点",
  "start_time": "{table_info.get('演出时间', '').split('至')[0].strip()}",
  "end_time": "{table_info.get('演出时间', '').split('至')[-1].strip()}",
  "place_cn": "{table_info.get('演出场所', '')}",
  "place_en": "英文场地",
  "place_jp": "日文场地",
  "artist_country_en": "艺术家国籍(英文)",
  "tag_cn": ["标签1", "标签2", "标签3", "标签4", "标签5"] // 最多5个标签最少3个标签,
  "tag_en": ["tag1", "tag2", "tag3", "tag4", "tag5"], // 最多5个标签最少3个标签,
  "tag_jp": ["タグ1", "タグ2", "タグ3", "タグ4", "タグ5"], // 最多5个标签最少3个标签,
  "artist_cn": "中文艺术家名",
  "artist_en": "英文艺术家名",
  "artist_jp": "日文艺术家名",
  "info_source_id": "{extracted_info['info_source_id']}"
}}

网页信息:
{table_info}

请补全缺失的信息并生成完整的JSON。"""}
            ]
        )
        
        # 使用正则表达式提取JSON
        json_match = re.search(r'\{[\s\S]*\}', completion.choices[0].message.content)
        if json_match:
            json_str = json_match.group()
            print(json_str)
            parsed_info = json.loads(json_str)
            
            # 立即保存解析出的信息
            save_performance_to_appwrite(parsed_info)
            
            return parsed_info
        else:
            logging.error("无法从AI响应中提取JSON")
            return None
    except Exception as e:
        logging.error(f"解析演出信息时出错: {e}")
        return None

def save_performance_to_appwrite(performance):
    try:
        # 添加创建时间
        performance['create_at'] = datetime.now().isoformat()
        
        databases.create_document(
            database_id='perinfo',
            collection_id='66e56af1001dac90eefb',
            document_id='unique()',
            data=performance
        )
        logging.info(f"成功保存演出信息: {performance['pername_cn']}")
    except Exception as e:
        logging.error(f"保存演出信息时出错: {e}")

def get_performance_info(page_num):
    url = f"https://zwfw.mct.gov.cn/swychd?performanceName=&performancePlace1=&performingBeginTime=&performingEndTime=&type=gb&pageNum={page_num}"
    try:
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
    except requests.RequestException as e:
        logging.error(f"获取页面 {page_num} 时发生错误: {e}")
        return []

    soup = BeautifulSoup(response.content, 'html.parser')
    
    table = soup.find('table', style="table-layout : fixed")
    if not table:
        logging.warning(f"在页面 {page_num} 中未找到表格")
        return []

    performances = []
    
    rows = table.find_all('tr')[1:]  # 跳过表头
    for row in rows:
        cols = row.find_all('td')
        if len(cols) == 2:
            link = cols[0].find('a')
            if link:
                name = link.get('title')
                href = 'https://zwfw.mct.gov.cn/' + link.get('href')
                date = cols[1].text.strip()
                info_source_id = href.split('=')[-1]  # 假设href的最后一部分是info_source_id
                
                if not check_performance_exists(info_source_id):
                    performance = {
                        '演出名称': name,
                        '演出时间': date,
                        'href': href,
                        'info_source_id': info_source_id
                    }
                    parsed_info = parse_performance_info(performance)
                    if parsed_info:
                        performances.append(parsed_info)
                else:
                    print(f"演出信息已存在，跳过: {name}")
    
    return performances

def job():
    logging.info("开始运行爬虫任务")
    start_time = time.time()
    
    try:
        for page in range(1, 700):  
            logging.info(f"正在获取第{page}页数据...")
            performances = get_performance_info(page)
            time.sleep(1)
    except Exception as e:
        logging.error(f"爬虫任务出错: {e}")
    finally:
        end_time = time.time()
        logging.info(f"爬虫任务完成，耗时: {end_time - start_time:.2f} 秒")

def run_threaded(job_func):
    job_thread = threading.Thread(target=job_func)
    job_thread.start()

if __name__ == "__main__":
    logging.info("爬虫程序启动")
    
    # 立即运行一次爬虫任务
    run_threaded(job)
    
    # 设置定时任务，每48小时运行一次
    schedule.every(48).hours.do(run_threaded, job)
    
    while True:
        schedule.run_pending()
        time.sleep(1)